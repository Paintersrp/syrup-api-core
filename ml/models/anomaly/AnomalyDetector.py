from keras.models import Sequential
from keras.layers import LSTM, RepeatVector, TimeDistributed, Dense
from typing import List, Optional
import numpy as np

from ...BaseModel import BaseModel


class AnomalyDetector(BaseModel):
    def __init__(
        self,
        timesteps: int,
        n_features: int,
        quantile: float = 0.99,
        layers: List[int] = [100, 50, 50, 100],
        patience: int = 5,
        save_dir: str = "./",
        test_size: float = 0.2,
        numerical_features: List[str] = [],
        categorical_features: List[str] = [],
        k_best_features: int = 10,
    ) -> None:
        """
        A class for detecting anomalies in time series data using an LSTM Autoencoder.

        Parameters
        ----------
        timesteps : int
            The number of timesteps for the LSTM model.
        n_features : int
            The number of features in the input dataset.
        quantile : float, optional
            The quantile level used to define what an anomaly is, by default 0.99.
        layers : List[int], optional
            The number of neurons in the LSTM layers, by default [100, 50, 50, 100].
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
        self.quantile = quantile

    def _build_model(self) -> Sequential:
        """
        Builds an LSTM Autoencoder model with 'relu' activation function for anomaly detection.

        Returns
        -------
        Sequential
            The constructed LSTM Autoencoder model.
        """

        model = Sequential()
        model.add(
            LSTM(
                self.layers[0],
                activation="relu",
                input_shape=(self.timesteps, self.n_features),
                return_sequences=True,
            )
        )
        model.add(LSTM(self.layers[1], activation="relu", return_sequences=False))
        model.add(RepeatVector(self.timesteps))
        model.add(LSTM(self.layers[2], activation="relu", return_sequences=True))
        model.add(LSTM(self.layers[3], activation="relu", return_sequences=True))
        model.add(TimeDistributed(Dense(self.n_features)))
        model.compile(optimizer="adam", loss="mse")
        return model

    def calculate_error(self, data: np.array) -> np.array:
        """
        Calculates the mean squared error of the reconstructed data from the Autoencoder.

        Parameters
        ----------
        data : np.array
            The input data to the Autoencoder.

        Returns
        -------
        np.array
            The mean squared error of each instance in the data.
        """

        # Transforming, scaling and reshaping data
        # Implementations of these methods are not shown in this snippet
        data = self.preprocessor.transform(data)
        data = self.feature_engineer.transform(data)
        data = self.feature_selector.transform(data)
        data = self.scaler.transform(data)
        data = data.reshape((len(data), self.timesteps, self.n_features))

        # Calculate MSE between the data and its reconstruction
        reconstructed = self.model.predict(data)
        mse = np.mean(np.power(data - reconstructed, 2), axis=1)
        return mse

    def calculate_threshold(self, data: np.array) -> float:
        """
        Calculates the error threshold for anomaly detection.

        Parameters
        ----------
        data : np.array
            The input data to the Autoencoder.

        Returns
        -------
        float
            The error threshold for anomaly detection.
        """

        error = self.calculate_error(data)
        return np.quantile(error, self.quantile)

    def is_anomaly(self, data: np.array, y: Optional[np.array] = None) -> np.array:
        """
        Predicts whether a data point is an anomaly.

        Parameters
        ----------
        data : np.array
            The input data.
        y : np.array, optional
            The true labels, by default None

        Returns
        -------
        np.array
            A boolean array indicating whether each data point is an anomaly.
        """

        error = self.calculate_error(data)
        return error > self.error_threshold

    def train(
        self,
        data: np.array,
        y: np.array,
        epochs: int = 10,
        batch_size: int = 32,
        verbose: int = 1,
    ) -> None:
        """
        Trains the LSTM Autoencoder on the provided data and calculates the error threshold for anomaly detection.

        Parameters
        ----------
        data : np.array
            The training data.
        y : np.array
            The target values.
        epochs : int, optional
            The number of epochs to train the model, by default 10.
        batch_size : int, optional
            The batch size for training, by default 32.
        verbose : int, optional
            Verbosity mode, 0 = silent, 1 = progress bar, 2 = one line per epoch. By default 1.
        """

        super().train(data, y, epochs, batch_size, verbose)
        val_data = data[int((1 - self.test_size) * len(data)) :]
        self.error_threshold = self.calculate_threshold(val_data)
