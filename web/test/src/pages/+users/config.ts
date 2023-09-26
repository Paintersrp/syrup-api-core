import { PageConfig } from '../../../../../api/core/utils/PageConfigBuilder/PageConfig';
import { genericFetch } from '../../utils/genericFetch';

const userPageConfig = new PageConfig()
  .setPath('/app/users')
  .setSEO({
    title: 'Users Page',
    description: 'User with detailed information.',
    keywords: 'users, details',
    url: 'https://yourwebsite.com/app/users',
    image: 'https://yourwebsite.com/path-to-your-image.jpg',
  })
  .setFetchData(genericFetch('users'))
  .finalize();

export default userPageConfig;
