import * as Yup from 'yup';

export const BlacklistSchema = Yup.object().shape({
  token: Yup.string()
    .required('Token is required')
    .min(5, 'Token must be at least 5 characters')
    .max(500, 'Token cannot exceed 50 characters'),
});
