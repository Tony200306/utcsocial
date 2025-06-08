function getCurrentTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  }
  return 'light';
}

export const theme = getCurrentTheme();

export const sidebarLinks = [
  {
    imgURL: `/assets/home-${theme}.svg`,
    route: "/",
    label: "Home",
  },
  {
    imgURL: `/assets/search-${theme}.svg`,
    route: "/search",
    label: "Search",
  },
  {
    imgURL: `/assets/heart-${theme}.svg`,
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: `/assets/create-${theme}.svg`,
    route: "/create-thread",
    label: "Create Thread",
  },
  {
    imgURL: `/assets/user-${theme}.svg`,
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: `/assets/message-${theme}.svg`,
    route: "/chat",
    label: "Chat",
  },
];


export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "repost", label: "Repost", icon: "/assets/tag.svg" },
];

