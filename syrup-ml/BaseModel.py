import os
from keras2onnx import convert_keras
import onnxmltools
from keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from typing import List, Tuple, Dict, Any
import pandas as pd

from .mixins.evaluator.ModelEvaluator import ModelEvaluator
from .mixins.preprocessor.Preprocessor import Preprocessor
from .mixins.selector.FeatureSelector import FeatureSelector
from .mixins.engineer.FeatureEngineer import FeatureEngineer
from .utils.validator.Validator import Validator


class BaseModel:
    """
    Base model for building and training a predictive model.

    Attributes:
        timesteps (int): Number of timesteps for the model.
        n_features (int): Number of features for the model.
        layers (List[int]): List of layer sizes.
        patience (int): Patience parameter for early stopping.
        save_dir (str): Directory to save the best model.
        test_size (float): Test size for the train-test split.
        numerical_features (List[str]): List of numerical feature names.
        categorical_features (List[str]): List of categorical feature names.
        k_best_features (int): Number of best features to select.
        preprocessor (Preprocessor): Instance of Preprocessor class.
        feature_selector (FeatureSelector): Instance of FeatureSelector class.
        feature_engineer (FeatureEngineer): Instance of FeatureEngineer class.
        scaler (MinMaxScaler): Instance of MinMaxScaler class from sklearn.
        model: Built Keras model.
    """

    def __init__(
        self,
        timesteps: int,
        n_features: int,
        layers: List[int] = [50, 30],
        patience: int = 5,
        save_dir: str = "./",
        test_size: float = 0.2,
        numerical_features: List[str] = [],
        categorical_features: List[str] = [],
        k_best_features: int = 10,
    ) -> None:
        """
        Initializes the BaseModel instance.

        Args:
            timesteps (int): Number of timesteps for the model.
            n_features (int): Number of features for the model.
            layers (List[int], optional): List of layer sizes. Defaults to [50, 30].
            patience (int, optional): Patience parameter for early stopping. Defaults to 5.
            save_dir (str, optional): Directory to save the best model. Defaults to "./".
            test_size (float, optional): Test size for the train-test split. Defaults to 0.2.
            numerical_features (List[str], optional): List of numerical feature names. Defaults to [].
            categorical_features (List[str], optional): List of categorical feature names. Defaults to [].
            k_best_features (int, optional): Number of best features to select. Defaults to 10.
        """

        self.timesteps = timesteps
        self.n_features = n_features
        self.layers = layers
        self.patience = patience
        self.save_dir = save_dir
        self.test_size = test_size
        self.numerical_features = numerical_features
        self.categorical_features = categorical_features
        self.k_best_features = k_best_features
        self.preprocessor = Preprocessor(numerical_features, categorical_features)
        self.feature_selector = FeatureSelector(k=k_best_features)
        self.feature_engineer = FeatureEngineer()
        self.validator = Validator()
        self.scaler = MinMaxScaler()
        self.model = self._build_model()

    def _build_model(self) -> None:
        """
        Builds the model architecture.

        Raises:
            NotImplementedError: This method should be implemented in a child class.
        """
        raise NotImplementedError

    def _get_keras_model(self) -> Any:
        """
        Returns the built Keras model.

        Returns:
            Any: Built Keras model.
        """
        return self.model

    def train(
        self,
        data: pd.DataFrame,
        y: pd.Series,
        epochs: int = 10,
        batch_size: int = 32,
        verbose: int = 1,
    ) -> None:
        """
        Trains the model.

        Args:
            data (pd.DataFrame): Input data for training.
            y (pd.Series): Labels for training.
            epochs (int, optional): Number of epochs for training. Defaults to 10.
            batch_size (int, optional): Batch size for training. Defaults to 32.
            verbose (int, optional): Verbosity mode (0 = silent, 1 = progress bar, 2 = one line per epoch). Defaults to 1.
        """

        data = self.preprocessor.fit_transform(data)
        data = self.feature_selector.fit_transform(data, y)
        data = self.scaler.fit_transform(data)
        data = data.reshape((len(data), self.timesteps, self.n_features))

        train_data, val_data = train_test_split(data, test_size=self.test_size)

        self.evaluator = ModelEvaluator(self._get_keras_model, data, y)
        es = EarlyStopping(monitor="val_loss", mode="min", patience=self.patience)
        mc = ModelCheckpoint(
            os.path.join(self.save_dir, "best_model.onnx"),
            monitor="val_loss",
            mode="min",
            save_best_only=True,
        )

        self.model.fit(
            train_data,
            train_data,
            validation_data=(val_data, val_data),
            epochs=epochs,
            batch_size=batch_size,
            verbose=verbose,
            callbacks=[es, mc],
        )

    def predict(self, data: pd.DataFrame) -> Any:
        """
        Makes predictions with the model.

        Args:
            data (pd.DataFrame): Input data for making predictions.

        Returns:
            Any: Predictions.
        """

        data = self.preprocessor.transform(data)
        data = self.feature_selector.transform(data)
        data = self.scaler.transform(data)
        data = data.reshape((len(data), self.timesteps, self.n_features))
        return self.model.predict(data)

    def save_model(self, filename: str) -> None:
        """
        Saves the model.

        Args:
            filename (str): The name of the file to save the model.
        """

        onnx_model = convert_keras(self.model, self.model.name)
        onnxmltools.utils.save_model(onnx_model, filename)

    def tune(self, param_grid: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tunes the model parameters.

        Args:
            param_grid (Dict[str, Any]): Parameter grid for tuning.

        Returns:
            Dict[str, Any]: Best parameters.
        """

        best_params = self.evaluator.tune(param_grid)
        return best_params

    def cross_validate(self) -> Tuple[float, float]:
        """
        Performs cross-validation.

        Returns:
            Tuple[float, float]: Mean score and standard deviation of scores.
        """

        mean_score, std_score = self.evaluator.cross_validate()
        return mean_score, std_score

    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, Any]:
        """
        Evaluates the model.

        Args:
            X_test (pd.DataFrame): Test data.
            y_test (pd.Series): Test labels.

        Returns:
            Dict[str, Any]: Evaluation results.
        """

        evaluation_result = self.evaluator.evaluate(X_test, y_test)
        return evaluation_result
