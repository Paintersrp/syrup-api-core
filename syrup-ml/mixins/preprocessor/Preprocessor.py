from typing import List
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


class Preprocessor:
    def __init__(
        self,
        numerical_features: List[str],
        categorical_features: List[str],
        numerical_strategy: str = "median",
        categorical_strategy: str = "most_frequent",
    ) -> None:
        """
        A class for preprocessing data.

        Parameters
        ----------
        numerical_features : List[str]
            The list of names of numerical features.
        categorical_features : List[str]
            The list of names of categorical features.
        numerical_strategy : str, optional
            The strategy to use for imputing numerical values, by default "median".
        categorical_strategy : str, optional
            The strategy to use for imputing categorical values, by default "most_frequent".
        """

        self.numerical_features = numerical_features
        self.categorical_features = categorical_features

        self.numerical_transformer = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy=numerical_strategy)),
                ("scaler", StandardScaler()),
            ]
        )

        self.categorical_transformer = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy=categorical_strategy)),
                ("onehot", OneHotEncoder(handle_unknown="ignore")),
            ]
        )

        self.preprocessor = ColumnTransformer(
            transformers=[
                ("num", self.numerical_transformer, numerical_features),
                ("cat", self.categorical_transformer, categorical_features),
            ]
        )

    def fit(self, X: np.array) -> "Preprocessor":
        """
        Fit the Preprocessor to the data.

        Parameters
        ----------
        X : np.array
            The input data.

        Returns
        -------
        Preprocessor
            The fitted Preprocessor.
        """

        self.preprocessor.fit(X)
        return self

    def transform(self, X: np.array) -> np.array:
        """
        Transform the input data using the fitted Preprocessor.

        Parameters
        ----------
        X : np.array
            The input data.

        Returns
        -------
        np.array
            The transformed data.
        """

        return self.preprocessor.transform(X)

    def fit_transform(self, X: np.array) -> np.array:
        """
        Fit the Preprocessor to the data and then transform the data.

        Parameters
        ----------
        X : np.array
            The input data.

        Returns
        -------
        np.array
            The transformed data.
        """

        return self.fit(X).transform(X)
