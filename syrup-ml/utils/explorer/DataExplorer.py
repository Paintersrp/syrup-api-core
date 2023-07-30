import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from typing import List


class DataExplorer:
    def __init__(self, df: pd.DataFrame):
        """
        Class for performing exploratory data analysis.

        Parameters
        ----------
        df : pd.DataFrame
            The DataFrame to be explored.
        """

        self.df = df

    def show_descriptive_stats(self) -> None:
        """
        Prints descriptive statistics for all numerical columns in the DataFrame.
        """

        print(self.df.describe())

    def visualize_distribution(self, features: List[str]) -> None:
        """
        Visualizes the distribution of specified features.

        Parameters
        ----------
        features : List[str]
            List of column names for which histograms will be plotted.
        """

        self.df[features].hist(bins=50, figsize=(20, 15))
        plt.show()

    def show_correlation_matrix(self, features: List[str]) -> None:
        """
        Displays a correlation matrix for specified features.

        Parameters
        ----------
        features : List[str]
            List of column names for which correlation matrix will be displayed.
        """

        corr_matrix = self.df[features].corr()
        plt.figure(figsize=(10, 10))
        sns.heatmap(corr_matrix, annot=True)
        plt.show()

    def show_heatmap(self) -> None:
        """
        Displays a heatmap for the DataFrame's correlation matrix.
        """

        plt.figure(figsize=(10, 10))
        sns.heatmap(self.df.corr(), square=True, annot=True)
        plt.show()

    def explore_categorical(self, categorical_features: List[str]) -> None:
        """
        Visualizes and prints value counts for specified categorical features.

        Parameters
        ----------
        categorical_features : List[str]
            List of column names of categorical features to explore.
        """

        for feature in categorical_features:
            print(self.df[feature].value_counts())
            sns.countplot(x=feature, data=self.df)
            plt.show()

    def handle_missing_values(self) -> None:
        """
        Prints a summary of missing values in the DataFrame.
        """

        missing_values = self.df.isnull().sum().sort_values(ascending=False)
        percentage_missing_values = (
            self.df.isnull().sum() / self.df.isnull().count()
        ).sort_values(ascending=False)
        missing_data = pd.concat(
            [missing_values, percentage_missing_values],
            axis=1,
            keys=["Total", "Percent"],
        )
        print(missing_data.head(20))

    def detect_outliers(self, features: List[str]) -> None:
        """
        Detects and prints the number of outliers in the specified features based on the IQR method.

        Parameters
        ----------
        features : List[str]
            List of column names to detect outliers in.
        """

        for feature in features:
            Q1 = np.percentile(self.df[feature], 25)
            Q3 = np.percentile(self.df[feature], 75)
            IQR = Q3 - Q1
            outlier_step = 1.5 * IQR
            outliers = self.df[
                (self.df[feature] < Q1 - outlier_step)
                | (self.df[feature] > Q3 + outlier_step)
            ]
            print(f"Feature {feature} has {outliers.shape[0]} outliers")
