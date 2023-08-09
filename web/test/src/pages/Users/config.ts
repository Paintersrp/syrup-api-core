import { PageConfig } from '../../../../../api/core/mixins/pageconfig/PageConfig';
import { fetchUsersData } from './fetch';

const userPageConfig = new PageConfig()
  .setPath('/app/users')
  .setSEO({
    title: 'Users Page',
    description: 'User with detailed information.',
    keywords: 'users, details',
    url: 'https://yourwebsite.com/app/users',
    image: 'https://yourwebsite.com/path-to-your-image.jpg',
  })
  .setFetchData(fetchUsersData)
  .finalize();

export default userPageConfig;
