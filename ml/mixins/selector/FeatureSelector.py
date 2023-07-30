from typing import Callable, Union
import numpy as np
from sklearn.feature_selection import SelectKBest, chi2, f_classif, mutual_info_classif


class FeatureSelector:
    def __init__(self, k: int = 10, score_func: Callable = f_classif) -> None:
        """
        A class for feature selection using SelectKBest.

        Parameters
        ----------
        k : int, optional
            The number of top features to select, by default 10.
        score_func : Callable, optional
            The function to calculate the score of each feature, by default f_classif.
        """

        self.selector = SelectKBest(score_func=score_func, k=k)

    def fit(self, X: np.array, y: Union[np.array, list]) -> "FeatureSelector":
        """
        Fit the FeatureSelector to the data.

        Parameters
        ----------
        X : np.array
            The input data.
        y : Union[np.array, list]
            The target values.

        Returns
        -------
        FeatureSelector
            The fitted FeatureSelector.
        """

        self.selector.fit(X, y)
        return self

    def transform(self, X: np.array) -> np.array:
        """
        Transform the input data using the fitted FeatureSelector.

        Parameters
        ----------
        X : np.array
            The input data.

        Returns
        -------
        np.array
            The transformed data.
        """

        return self.selector.transform(X)

    def fit_transform(self, X: np.array, y: Union[np.array, list]) -> np.array:
        """
        Fit the FeatureSelector to the data and then transform the data.

        Parameters
        ----------
        X : np.array
            The input data.
        y : Union[np.array, list]
            The target values.

        Returns
        -------
        np.array
            The transformed data.
        """

        return self.fit(X, y).transform(X)
