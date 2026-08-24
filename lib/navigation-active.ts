export const normalizeNavigationPathname = (pathname: string | null) => {
  if (!pathname) return "/";
  const normalized = pathname.replace(/\/+$/u, "");
  return normalized || "/";
};

export const isNavigationItemCurrent = (
  pathname: string | null,
  href: string,
) => {
  const currentPathname = normalizeNavigationPathname(pathname);
  const publicationPathname = normalizeNavigationPathname(href);

  return (
    currentPathname === publicationPathname ||
    (publicationPathname !== "/" &&
      currentPathname.startsWith(`${publicationPathname}/`))
  );
};
