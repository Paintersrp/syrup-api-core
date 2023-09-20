import * as Yup from 'yup';

function capitalize(string: any) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const socialFieldSchema = Yup.string()
  .trim()
  .min(2, (field) => `${capitalize(field)} must be at least 2 characters`)
  .max(30, (field) => `${capitalize(field)} cannot exceed 30 characters`);

export const ProfileSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .min(5, 'Email Address must be at least 5 characters')
    .max(50, 'Email Address cannot exceed 50 characters'),
  firstName: Yup.string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name cannot exceed 30 characters'),
  lastName: Yup.string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(40, 'Last name cannot exceed 40 characters'),
  bio: Yup.string().trim().max(1024, 'Bio cannot exceed 1024 characters'),
  city: Yup.string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City cannot exceed 50 characters'),
  country: Yup.string()
    .trim()
    .min(2, 'Country must be at least 2 characters')
    .max(30, 'Country cannot exceed 30 characters'),
  phone: socialFieldSchema,
  facebook: socialFieldSchema,
  instagram: socialFieldSchema,
  threads: socialFieldSchema,
  twitter: socialFieldSchema,
  github: socialFieldSchema,
  youtube: socialFieldSchema,
  linkedIn: socialFieldSchema,
});

export default ProfileSchema;
