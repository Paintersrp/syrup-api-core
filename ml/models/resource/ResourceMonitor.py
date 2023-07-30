import numpy as np
import pandas as pd
from keras.models import Sequential
from keras.layers import LSTM, Dense
from typing import List, Dict, Tuple


from ...BaseModel import BaseModel


class ResourceMonitor(BaseModel):
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
        A resource monitor based on the LSTM neural network.

        Parameters
        ----------
        timesteps : int
            The number of timesteps for the LSTM model.
        n_features : int
            The number of features in the input dataset.
        layers : List[int], optional
            The number of neurons in the LSTM layers, by default [50, 30].
        patience : int, optional
            The number of epochs with no improvement after which training will be stopped, by default 5.
        save_dir : str, optional
            The directory where the model will be saved, by default "./".
        test_size : float, optional
            The size of the test set, by default 0.2.
        numerical_features : List[str], optional
            List of names of numerical features in the dataset, by default [].
        categorical_features : List[str], optional
            List of names of categorical features in the dataset, by default [].
        k_best_features : int, optional
            The number of top features to select based on "f_classif", by default 10.
        """

        super().__init__(
            timesteps,
            n_features,
            layers,
            patience,
            save_dir,
            test_size,
            numerical_features,
            categorical_features,
            k_best_features,
        )
        self.scaler_range: Dict[str, Tuple[float, float]] = {}

    def _build_model(self) -> Sequential:
        """
        Builds the LSTM model.

        Returns
        -------
        Sequential
            The constructed LSTM model.
        """

        model = Sequential()
        model.add(
            LSTM(
                self.layers[0],
                return_sequences=True,
                input_shape=(self.timesteps, self.n_features),
            )
        )
        model.add(LSTM(self.layers[1]))
        model.add(Dense(self.n_features))
        model.compile(loss="mean_squared_error", optimizer="adam")
        return model

    def normalize(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Normalizes numerical features in the dataset.

        Parameters
        ----------
        data : pd.DataFrame
            The dataset to normalize.

        Returns
        -------
        pd.DataFrame
            The normalized dataset.
        """

        for feature in self.numerical_features:
            feature_min, feature_max = np.min(data[feature]), np.max(data[feature])
            self.scaler_range[feature] = (feature_min, feature_max)
            data[feature] = (data[feature] - feature_min) / (feature_max - feature_min)
        return data

    def denormalize(self, data: np.array, feature: str) -> np.array:
        """
        Denormalizes data for a specific feature.

        Parameters
        ----------
        data : np.array
            The data to denormalize.
        feature : str
            The feature name to use for denormalization.

        Returns
        -------
        np.array
            The denormalized data.
        """

        feature_min, feature_max = self.scaler_range[feature]
        return data * (feature_max - feature_min) + feature_min

    def train(
        self,
        data: pd.DataFrame,
        y: np.array,
        epochs: int = 10,
        batch_size: int = 32,
        verbose: int = 1,
    ) -> None:
        """
        Trains the model.

        Parameters
        ----------
        data : pd.DataFrame
            The input data for training.
        y : np.array
            The target output data for training.
        epochs : int, optional
            The number of times the learning algorithm will work through the entire training dataset, by default 10.
        batch_size : int, optional
            The number of training examples utilized in one iteration, by default 32.
        verbose : int, optional
            Verbosity mode, 0 = silent, 1 = progress bar, 2 = one line per epoch.
        """

        data = self.normalize(data)
        super().train(data, y, epochs, batch_size, verbose)

    def predict(self, data: pd.DataFrame) -> np.array:
        """
        Makes a prediction using the trained model.

        Parameters
        ----------
        data : pd.DataFrame
            The input data for prediction.

        Returns
        -------
        np.array
            The prediction result.
        """

        data = self.normalize(data)
        return super().predict(data)
