# ToDo List

## 1. Preprocessing Options

- [ ] Add support for other imputing strategies, such as KNN imputer or iterative imputer.
- [ ] Add support for other scaling methods, like MinMaxScaler or RobustScaler.
- [ ] Add support for other categorical encoding methods, such as ordinal encoding or target encoding.

## 2. Flexibility

- [ ] Implement a method to add or remove features from the numerical or categorical list after instantiation.
- [ ] Implement a method to update the preprocessing strategies for numerical and categorical features after instantiation.

## 3. Robustness

- [ ] Include checks for appropriate input types and values, as well as handling potential exceptions and errors.
- [ ] Add checks to confirm that `fit` has been called before `transform`.

## 4. Efficiency

- [ ] Optimize for large datasets.
- [ ] Improve efficiency of `fit_transform` method by avoiding redundant operations.

## 5. Feature Names

- [ ] Implement a method to return the names of the transformed features, especially for one-hot encoded features.

## 6. Transformation Inverse

- [ ] Add a method to perform the inverse transformation (useful for interpretability of predictions).

## 7. Data Leakage Prevention

- [ ] Add functionality to help prevent data leakage in time series data or other special cases.

## 8. Code Quality

- [ ] Add docstrings and comments to all methods.
- [ ] Ensure the code complies with PEP 8 for better readability and maintainability.

## 9. Testing

- [ ] Write unit tests for all methods.

## 10. Documentation

- [ ] Provide a comprehensive README with usage examples.
- [ ] Include visualizations in the documentation to illustrate how preprocessing works.
