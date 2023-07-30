# ToDo List

## 1. Feature Selection Methods

- [ ] Extend `FeatureSelector` to include more feature selection methods like Recursive Feature Elimination, L1-based feature selection, and tree-based feature selection.
- [ ] Add functionality to choose different score functions such as `mutual_info_regression` for regression tasks.

## 2. Hyperparameter Tuning

- [ ] Implement method to tune the parameter 'k' in SelectKBest.
- [ ] Implement a method to choose the best `score_func` according to cross-validation performance.

## 3. Performance Metrics

- [ ] Add a method to display feature scores and p-values after fitting.
- [ ] Implement a method to evaluate the performance of the feature selection based on a given model.

## 4. Robustness

- [ ] Include checks for appropriate input types and values, as well as handling potential exceptions and errors.
- [ ] Add checks to confirm that `fit` has been called before `transform`.

## 5. Efficiency

- [ ] Optimize for large datasets.
- [ ] Improve efficiency of `fit_transform` method by avoiding redundant operations.

## 6. Feature Importance

- [ ] Add method to visualize feature importance.
- [ ] Implement a method to return a dataframe with selected feature names and their scores.

## 7. Cross Validation

- [ ] Implement a method to perform cross-validation to find the optimal number of features.
- [ ] Add support for StratifiedKFold or TimeSeriesSplit, depending on the nature of the data.

## 8. Code Quality

- [ ] Add docstrings and comments to all methods.
- [ ] Ensure the code complies with PEP 8 for better readability and maintainability.

## 9. Testing

- [ ] Write unit tests for all methods.

## 10. Documentation

- [ ] Provide a comprehensive README with usage examples.
- [ ] Include visualizations in the documentation to illustrate how feature selection works.
