import 'package:flutter/material.dart';
import 'package:instagram/classes/navigator_keys.dart';
import 'package:instagram/screens/home/components/bottom_nav.dart';
import 'package:instagram/screens/home/components/side_nav.dart';
import 'package:instagram/screens/home/explore/explore_page.dart';
import 'package:instagram/screens/home/feed/feed_page.dart';
import 'package:instagram/screens/home/profile/profile_page.dart';
import 'package:instagram/screens/home/reels/reels_page.dart';
import 'package:instagram/screens/home/shop/shop_page.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:provider/provider.dart';
import 'package:responsive_builder/responsive_builder.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with AutomaticKeepAliveClientMixin {
  late final List<Navigator> pages;
  late final PageController pageController;

  late final NavigatorKeys navigatorKeys;

  late GlobalKey<NavigatorState> pageNavigator;
  int _currentPageIndex = 0;

  @override
  void initState() {
    pageController = PageController(initialPage: 0, keepPage: true);
    navigatorKeys = Provider.of<NavigatorKeys>(context, listen: false);
    pages = [
      Navigator(
        key: navigatorKeys.feedPageNavKey,
        onPopPage: (route, result) {
          return route.didPop(result);
        },
        pages: const [MaterialPage(child: FeedPage())],
      ),
      Navigator(
        key: navigatorKeys.explorePageNavKey,
        onPopPage: (route, result) {
          return route.didPop(result);
        },
        pages: const [MaterialPage(child: ExplorePage())],
      ),
      Navigator(
        key: navigatorKeys.reelsPageNavKey,
        onPopPage: (route, result) {
          return route.didPop(result);
        },
        pages: const [MaterialPage(child: ReelsPage())],
      ),
      Navigator(
        key: navigatorKeys.shopPageNavKey,
        onPopPage: (route, result) {
          return route.didPop(result);
        },
        pages: const [MaterialPage(child: ShopPage())],
      ),
      Navigator(
        key: navigatorKeys.profilePageNavKey,
        onPopPage: (route, result) {
          return route.didPop(result);
        },
        pages: [
          MaterialPage(
              child: ProfilePage(
            inPageView: true,
            user: AuthService().connectedUser!,
          ))
        ],
      ),
    ];

    super.initState();
  }

  void movePage(pageIndex) {
    // If the clicked page is already dispalyed
    if (pageController.page == pageIndex.toDouble()) {
      // If the navigator can be poped
      if (pageNavigator.currentState!.canPop()) {
        pageNavigator.currentState!.popUntil((route) => route.isFirst);
      }
    } else {
      setState(() {
        _currentPageIndex = pageIndex;
      });
      pageController.jumpToPage(pageIndex);
    }
  }

  Widget _sideMenu() {
    return SideNav(onTap: movePage, currentPageIdx: _currentPageIndex);
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    pageNavigator = [
      navigatorKeys.feedPageNavKey,
      navigatorKeys.explorePageNavKey,
      navigatorKeys.reelsPageNavKey,
      navigatorKeys.shopPageNavKey,
      navigatorKeys.profilePageNavKey
    ][_currentPageIndex];
    bool isDesktop =
        getDeviceType(MediaQuery.of(context).size) == DeviceScreenType.desktop;

    return WillPopScope(
      onWillPop: () async {
        // If the current navigator can be poped
        if (pageNavigator.currentState!.canPop()) {
          pageNavigator.currentState!.pop(); // Pops page
        } else {
          // If we on the feed page and the feed navigator can not be poped
          if (pageController.page == 0) {
            return true; // exit the application
          }
          // If we are not in the feed page and the current navigator can not be poped
          else {
            // Jump to the feed page

            setState(() {
              _currentPageIndex = 0;
            });
            pageController.jumpToPage(0);
          }
        }

        return false;
      },
      child: Scaffold(
        body: Row(
          children: [
            if (isDesktop) _sideMenu(),
            Expanded(
              child: PageView(
                physics: const NeverScrollableScrollPhysics(),
                controller: pageController,
                children: pages,
              ),
            ),
          ],
        ),
        bottomNavigationBar: !isDesktop
            ? BottomNav(onTap: movePage, currentPageIdx: _currentPageIndex)
            : null,
      ),
    );
  }

  @override
  void dispose() {
    pageController.dispose();
    super.dispose();
  }

  @override
  bool get wantKeepAlive => true;
}
