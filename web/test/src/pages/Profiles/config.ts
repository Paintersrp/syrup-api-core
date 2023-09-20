import { PageConfig } from '../../../../../api/core/utils/PageConfigBuilder/PageConfig';
import { genericFetch } from '../../utils/genericFetch';

const profilePageConfig = new PageConfig()
  .setPath('/app/profiles')
  .setSEO({
    title: 'Profile Page',
    description: 'User profiles with detailed information.',
    keywords: 'profiles, users, details',
    url: 'https://yourwebsite.com/app/profiles',
    image: 'https://yourwebsite.com/path-to-your-image.jpg',
  })
  .setFetchData(genericFetch('profile'))
  .finalize();

export default profilePageConfig;
