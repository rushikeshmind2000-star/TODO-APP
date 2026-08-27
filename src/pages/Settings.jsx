import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Profile from './Profile';

// Settings is an alias/extension of Profile with additional system settings
export default function Settings() {
  return <Profile />;
}
