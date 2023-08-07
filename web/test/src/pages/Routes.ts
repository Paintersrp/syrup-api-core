import { fetchProfiles } from '../components/Profiles/fetchProfiles';
import { Profiles } from '../components/Profiles/Profiles';
import { fetchUsersData } from './fetch';
import { Users } from '../components/Users/Users';

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
