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
    label: "Trabf chủ",
  },
  {
    imgURL: `/assets/search-${theme}.svg`,
    route: "/search",
    label: "Tìm kiếm",
  },
  {
    imgURL: `/assets/heart-${theme}.svg`,
    route: "/activity",
    label: "Hoạt động",
  },
  {
    imgURL: `/assets/create-${theme}.svg`,
    route: "/create-thread",
    label: "Tạo bài viết",
  },
  {
    imgURL: `/assets/user-${theme}.svg`,
    route: "/profile",
    label: "Hồ sơ",
  },
  {
    imgURL: `/assets/message-${theme}.svg`,
    route: "/chat",
    label: "Tin nhắn",
  },
];


export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "repost", label: "Repost", icon: "/assets/tag.svg" },
];

