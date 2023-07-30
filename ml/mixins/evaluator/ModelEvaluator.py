from typing import Callable, Dict, Tuple
import numpy as np
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit, cross_val_score
from scikeras.wrappers import KerasRegressor


class ModelEvaluator:
    def __init__(
        self, model_builder_func: Callable, X: np.array, y: np.array, n_splits: int = 5
    ) -> None:
        """
        ModelEvaluator class is used for tuning, cross-validating and evaluating a machine learning model.

        Parameters
        ----------
        model_builder_func : Callable
            A function to build the machine learning model.
        X : np.array
            The input features for the model.
        y : np.array
            The target variable for the model.
        n_splits : int, optional
            The number of folds for cross-validation, by default 5.
        """

        self.model_builder_func = model_builder_func
        self.X = X
        self.y = y
        self.n_splits = n_splits
        self.model = KerasRegressor(build_fn=self.model_builder_func, verbose=0)
        self.tscv = TimeSeriesSplit(n_splits=self.n_splits)

    def tune(self, param_grid: Dict) -> Dict:
        """
        Grid search over specified parameter values for an estimator.

        Parameters
        ----------
        param_grid : dict
            Dictionary with parameters names (str) as keys and lists of parameter settings to try as values.

        Returns
        -------
        dict
            Dictionary with the best parameters.
        """

        grid = GridSearchCV(estimator=self.model, param_grid=param_grid, cv=self.tscv)
        grid_result = grid.fit(self.X, self.y)
        print("Best: %f using %s" % (grid_result.best_score_, grid_result.best_params_))
        return grid_result.best_params_

    def cross_validate(self) -> Tuple[float, float]:
        """
        Evaluate a score by cross-validation.

        Returns
        -------
        Tuple[float, float]
            Mean and standard deviation of the cross-validation score.
        """

        results = cross_val_score(self.model, self.X, self.y, cv=self.tscv)
        print(
            "Cross validation score: %.2f (%.2f) MSE" % (results.mean(), results.std())
        )
        return results.mean(), results.std()

    def evaluate(self, X_test: np.array, y_test: np.array) -> float:
        """
        Evaluate the model on the test set.

        Parameters
        ----------
        X_test : np.array
            The input features for the test set.
        y_test : np.array
            The target variable for the test set.

        Returns
        -------
        float
            Evaluation score for the test set.
        """

        self.model.fit(self.X, self.y)
        evaluation_result = self.model.score(X_test, y_test)
        print("Evaluation score: %.2f" % evaluation_result)
        return evaluation_result
