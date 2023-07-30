from typing import Optional
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.preprocessing import PolynomialFeatures
from scipy.stats import zscore


# General for now - Needs domain knowledge implementation


class FeatureEngineer(BaseEstimator, TransformerMixin):
    """
    FeatureEngineer is a class for creating additional features from the existing features in a dataset.

    Attributes:
    -----------
    pca : PCA
        Principal Component Analysis transformer
    kmeans : KMeans
        KMeans clustering model
    poly : PolynomialFeatures
        Polynomial Features transformer
    """

    def __init__(self) -> None:
        self.pca = PCA(n_components=2)
        self.kmeans = KMeans(n_clusters=2)
        self.poly = PolynomialFeatures(degree=3, include_bias=False)

    def fit(self, X: np.ndarray, y: Optional[np.ndarray] = None) -> "FeatureEngineer":
        """
        Fit the PCA, KMeans and PolynomialFeatures instances on the data.

        Parameters
        ----------
        X : np.ndarray
            The input features to fit the transformer.
        y : np.ndarray, optional
            The target variable, not used in unsupervised transformers.

        Returns
        -------
        FeatureEngineer
            The instance of the transformer itself.
        """

        self.pca.fit(X)
        self.kmeans.fit(X)
        self.poly.fit(X)
        return self

    def add_interactions(self, X: np.ndarray) -> np.ndarray:
        """
        Add interaction features to the data.

        Parameters
        ----------
        X : np.ndarray
            The input features.

        Returns
        -------
        np.ndarray
            The transformed input features.
        """

        interactions = self.poly.transform(X)
        return np.concatenate([X, interactions], axis=1)

    def add_pca_features(self, X: np.ndarray) -> np.ndarray:
        """
        Add principal components to the data.

        Parameters
        ----------
        X : np.ndarray
            The input features.

        Returns
        -------
        np.ndarray
            The transformed input features.
        """

        principalComponents = self.pca.transform(X)
        return np.concatenate([X, principalComponents], axis=1)

    def add_cluster_features(self, X: np.ndarray) -> np.ndarray:
        """
        Add cluster labels to the data.

        Parameters
        ----------
        X : np.ndarray
            The input features.

        Returns
        -------
        np.ndarray
            The transformed input features.
        """

        clusters = self.kmeans.predict(X)
        return np.concatenate([X, clusters.reshape(-1, 1)], axis=1)

    def add_zscores(self, X: np.ndarray) -> np.ndarray:
        """
        Add z-scores to the data.

        Parameters
        ----------
        X : np.ndarray
            The input features.

        Returns
        -------
        np.ndarray
            The transformed input features.
        """

        z_scores = zscore(X, axis=0)
        return np.concatenate([X, z_scores], axis=1)

    def transform(self, X: np.ndarray, y: Optional[np.ndarray] = None) -> np.ndarray:
        """
        Add interaction, PCA, cluster and z-score features to the data.

        Parameters
        ----------
        X : np.ndarray
            The input features.
        y : np.ndarray, optional
            The target variable, not used in unsupervised transformers.

        Returns
        -------
        np.ndarray
            The transformed input features.
        """

        X = self.add_interactions(X)
        X = self.add_pca_features(X)
        X = self.add_cluster_features(X)
        X = self.add_zscores(X)
        return X
