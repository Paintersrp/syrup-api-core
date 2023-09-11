import * as Yup from 'yup';

export const CacheSchema = Yup.object().shape({
  contents: Yup.mixed()
    .test('is-json', 'Contents must be a valid JSON object', (value: any) => {
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return false;
      }
    })
    .required('Contents is required'),
});
