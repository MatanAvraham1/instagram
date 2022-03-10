import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:instagram/classes/navigator_keys.dart';
import 'package:instagram/screens/home/explore/explore_page.dart';
import 'package:instagram/screens/home/feed/feed_page.dart';
import 'package:instagram/screens/home/profile/profile_page.dart';
import 'package:instagram/screens/home/reels/reels_page.dart';
import 'package:instagram/screens/home/shop/shop_page.dart';
import 'package:instagram/services/auth_service.dart';
import 'package:provider/provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with AutomaticKeepAliveClientMixin {
  late final List<Navigator> pages;
  late final PageController pageController;
  late NavigatorKeys navigatorKeys;

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
            user: AuthSerivce.connectedUser!,
          ))
        ],
      ),
    ];

    super.initState();
  }

  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    var pageNavigator = [
      navigatorKeys.feedPageNavKey,
      navigatorKeys.explorePageNavKey,
      navigatorKeys.reelsPageNavKey,
      navigatorKeys.shopPageNavKey,
      navigatorKeys.profilePageNavKey
    ][_currentIndex];

    super.build(context);

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
              _currentIndex = 0;
            });
            pageController.jumpToPage(0);
          }
        }

        return false;
      },
      child: Scaffold(
        body: PageView(
          physics: const NeverScrollableScrollPhysics(),
          controller: pageController,
          children: pages,
        ),
        bottomNavigationBar: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (value) {
              // If the clicked page is already dispalyed
              if (pageController.page == value.toDouble()) {
                // If the navigator can be poped
                if (pageNavigator.currentState!.canPop()) {
                  pageNavigator.currentState!
                      .popUntil((route) => route.isFirst);
                }
              } else {
                setState(() {
                  _currentIndex = value;
                });
                pageController.jumpToPage(value);
              }
            },
            items: [
              BottomNavigationBarItem(
                  icon: _currentIndex == 0
                      ? const Icon(Icons.home_filled)
                      : SvgPicture.asset(
                          "assets/images/home_outlined.svg",
                          width: 20,
                          color: Theme.of(context)
                              .bottomNavigationBarTheme
                              .unselectedItemColor,
                        ),
                  label: "Home"),
              BottomNavigationBarItem(
                  icon: _currentIndex == 1
                      ? const Icon(Icons.explore)
                      : SvgPicture.asset(
                          "assets/images/explore_outlined.svg",
                          width: 20,
                          color: Theme.of(context)
                              .bottomNavigationBarTheme
                              .unselectedItemColor,
                        ),
                  label: "Explore"),
              BottomNavigationBarItem(
                  icon: Icon(_currentIndex == 2
                      ? Icons.video_collection
                      : Icons.video_collection_outlined),
                  label: "Reels"),
              BottomNavigationBarItem(
                  icon: Icon(_currentIndex == 3
                      ? Icons.shopping_bag
                      : Icons.shopping_bag_outlined),
                  label: "Shop"),
              BottomNavigationBarItem(
                  icon: Icon(_currentIndex == 4
                      ? Icons.account_circle
                      : Icons.account_circle_outlined),
                  label: "Profile"),
            ]),
      ),
    );
  }

  @override
  bool get wantKeepAlive => true;
}
