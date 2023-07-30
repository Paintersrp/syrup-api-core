# ToDo List

## 1. Flexibility

- [ ] Provide the ability to select and order the transformations that should be applied.
- [ ] Allow the number of PCA components and KMeans clusters to be set by the user.

## 2. Optimization

- [ ] Implement methods to determine the optimal number of PCA components and KMeans clusters.

## 3. Efficiency

- [ ] Improve efficiency by avoiding multiple concatenation operations in the transform method.

## 4. Customization

- [ ] Allow custom transformations to be passed in by the user.

## 5. Model Performance

- [ ] Implement methods to evaluate the effectiveness of each transformation in terms of improving model performance.

## 6. Additional Features

- [ ] Add functionality for binning continuous variables.
- [ ] Add functionality for other forms of feature engineering like target encoding for categorical variables.

## 7. Reporting

- [ ] Include methods to visualize the effect of transformations on the data.

## 8. Robustness

- [ ] Add checks to confirm that `fit` has been called before `transform`.

## 9. Documentation

- [ ] Include docstrings for all methods to explain their functionality.
- [ ] Provide usage examples in the class documentation.

## 10. Testing

- [ ] Write comprehensive unit tests to ensure the class functions as expected.

## 11. Code Quality

- [ ] Ensure the code is PEP 8 compliant for readability and maintainability.
