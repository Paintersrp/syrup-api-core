class ValidationError(Exception):
    """Custom exception raised for validation errors."""

    pass


class Validator:
    @staticmethod
    def check_type(variable, expected_type, var_name):
        if not isinstance(variable, expected_type):
            raise ValidationError(
                f"{var_name} must be of type {expected_type.__name__}, "
                f"but got type {type(variable).__name__}."
            )

    @staticmethod
    def check_shape(variable, expected_shape, var_name):
        if variable.shape != expected_shape:
            raise ValidationError(
                f"{var_name} must be of shape {expected_shape}, but got shape {variable.shape}."
            )

    @staticmethod
    def check_value(variable, expected_values, var_name):
        if variable not in expected_values:
            raise ValidationError(
                f"{var_name} must be one of {expected_values}, but got {variable}."
            )

    @staticmethod
    def check_config(config, config_name):
        for param, type_ in config.items():
            if not isinstance(param, type_):
                raise TypeError(f"{config_name} must be of type {type_}.")

    @staticmethod
    def check_value_range(value, lower, upper, param_name):
        if not lower <= value <= upper:
            raise ValueError(f"{param_name} must be between {lower} and {upper}.")
