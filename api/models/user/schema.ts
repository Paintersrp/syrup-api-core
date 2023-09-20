import * as Yup from 'yup';

export const UserSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required.')
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username cannot exceed 20 characters.')
    .matches(/^\w+$/, 'Username can only contain letters, numbers, and underscores.'),
  password: Yup.string()
    .required('Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.'
    ),
});

export default UserSchema;