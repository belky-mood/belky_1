import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo} from 'react';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
  IconCheck,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export function Layout({children, layout}) {
  const {headerMenu, footerMenu} = layout;
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && <Header title={layout.shop.name} menu={headerMenu} />}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({title, menu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({menu, onClose}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({title, isHome, openCart, openMenu}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-contrast/80 text-primary'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({isHome, menu, openCart, title}) {
  const params = useParams();
  const {y} = useWindowScroll();
  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-contrast/80 text-primary '
          : 'bg-contrast/80 text-primary'
      } ${
        !isHome && y > 50 && ' shadow-lightHeader'
      } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
    >
      <div className="flex gap-12">
        <Link className="font-bold" to="/" prefetch="intent">
          {/* {title} */}
          <img style={{width:"70px", height:"70px"}} src="https://belkymood.com/cdn/shop/files/isla_500x500.37027387_ik2kq67o_431x.jpg?v=1614294555"/>
        </Link>
        <nav className="flex gap-8 items-center">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({isActive}) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form>
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({isHome, openCart}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      display='flex'
      role="contentinfo"
      className={`w-full  text-white `}
        style={{background: "#663d65", display: "block", height:"30rem"}}
    >
      <FooterMenu menu={menu} />
      {/* <CountrySelector /> */}
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / BELKYmood Jewelry. All Rights Reserved.
      </div>
    </Section>
  );
}

function FooterLink({item}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} >
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}) {
  // const styles = {
  //   section: 'grid gap-4',
  //   nav: 'grid gap-2 pb-6',
  // };

  return (
    <section className="w-full h-80 mb-6">
    <div className="w-full h-auto flex mb-6">
      <h3 className="text-white">Newsletter Section</h3>
    </div>
    <div className="w-full flex text-white">
      <div className="flex-1 " >
      <img style={{width:"150px", height:"150p"}} src="https://belkymood.com/cdn/shop/files/isla_500x500.37027387_ik2kq67o_431x.jpg?v=1614294555"/>
      <div>
      
      </div>
      </div>
      <div className="flex-1">
        <p className='mb-3'><b >LINKS</b></p>
         <ul>
          {menu.items.map(item=>(
            <li key={item.id} className='mb-3'>
              <FooterLink item={item}/>
            </li>
          ))}
         </ul>
      </div>
      <div className="flex-1 text-sm">
        <p className='mb-3'><b >Contact Us</b></p>
         <ul>
          <li><IconCheck className="inline-block mr-2 mb-3"/>1121 E Spring Creek Pkwy Ste 110-154 Plano, TX 75074 </li>
          <li><IconCheck className="inline-block mr-2 mb-3"/>Phone:+1 972-774-1001  </li>
          <li><IconCheck className="inline-block mr-2 mb-3"/>Email:info@belkymood.com </li>
          <li><IconCheck className="inline-block mr-2 mb-3"/>10.00AM - 6.00PM </li>
         </ul>
      </div>
    </div>
</section>
  )
}
