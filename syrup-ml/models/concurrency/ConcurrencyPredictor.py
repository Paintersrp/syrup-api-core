from keras.models import Sequential
from keras.layers import LSTM, Dense
from typing import List

from ...BaseModel import BaseModel


class ConcurrencyPredictor(BaseModel):
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
        A predictor model for handling concurrency based on LSTM architecture.

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

    def _build_model(self) -> Sequential:
        """
        Builds the LSTM model with 'relu' activation function.

        Returns
        -------
        Sequential
            The constructed LSTM model.
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
        model.add(LSTM(self.layers[1], activation="relu"))
        model.add(Dense(self.n_features))
        model.compile(optimizer="adam", loss="mse")
        return model
