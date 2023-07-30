# ToDo List

## 1. Flexibility

- [ ] Allow the use of different cross-validation strategies.
- [ ] Include an option for user-defined scoring metrics.

## 2. Optimization

- [ ] Add support for other hyperparameter optimization methods, such as RandomizedSearchCV or Bayesian Optimization.

## 3. Parallelization

- [ ] Enable the option for parallel computation for grid search and cross-validation if resources allow.

## 4. Customization

- [ ] Allow for user-defined splitting strategies, especially for dealing with special data types like time series or grouped data.
- [ ] Implement a way for users to add custom scoring functions.

## 5. Reporting

- [ ] Include more detailed reports on cross-validation results, like minimum, maximum scores, etc.
- [ ] Provide a method to visualize the cross-validation results and grid search results.

## 6. Model Persistence

- [ ] Add methods to save and load the best model found in hyperparameter tuning.

## 7. Robustness

- [ ] Add error and exception handling for cases where model training or evaluation may fail.
- [ ] Include checks to confirm that `fit` or `tune` has been called before `evaluate`.

## 8. Documentation

- [ ] Include docstrings for all methods to explain their functionality.
- [ ] Provide usage examples in the class documentation.

## 9. Testing

- [ ] Write comprehensive unit tests to ensure the class functions as expected.

## 10. Code Quality

- [ ] Ensure the code is PEP 8 compliant for readability and maintainability.
