import { fetchProfiles } from './Profiles/fetch';
import { Profiles } from './Profiles/page';
import { fetchUsersData } from './Users/fetch';
import Users from './Users/page';

export const routes = [
  {
    path: '/usersyeet',
    component: Users,
    fetchData: fetchUsersData,
    title: 'Users Page',
    metaDescription: 'List of all users',
  },
  {
    path: '/profilesyeet',
    component: Profiles,
    fetchData: fetchProfiles,
    title: 'Profiles Page',
    metaDescription: 'List of all user profiles',
  },
];
