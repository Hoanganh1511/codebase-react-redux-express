const titleMap = {
  '/': 'News Feed',
  '/home': 'News Feed',
  '/signin': 'Sign In',
  '/signup': 'Sign Up'
}

export const getTitleFromRoute = (path: string) => {
  if (titleMap[path]) {
    return `${titleMap[path]} | TuanAnh Social`
  }
}
