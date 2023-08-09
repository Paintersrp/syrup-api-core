import { PageConfig } from '../../../../../api/core/mixins/pageconfig/PageConfig';
import { fetchProfiles } from './fetch';

const profilePageConfig = new PageConfig()
  .setPath('/app/profiles')
  .setSEO({
    title: 'Profile Page',
    description: 'User profiles with detailed information.',
    keywords: 'profiles, users, details',
    url: 'https://yourwebsite.com/app/profiles',
    image: 'https://yourwebsite.com/path-to-your-image.jpg',
  })
  .setFetchData(fetchProfiles)
  .finalize();

export default profilePageConfig;
