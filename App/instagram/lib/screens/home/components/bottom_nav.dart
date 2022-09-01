import 'package:flutter/material.dart';
import 'package:instagram/themes/themes.dart';

class BottomNav extends StatefulWidget {
  final void Function(int) onTap;
  final int currentPageIdx;

  const BottomNav({
    Key? key,
    required this.onTap,
    required this.currentPageIdx,
  }) : super(key: key);

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      width: double.infinity,
      color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
      child: Row(
        children: [
          BottomNavItem(
            onTap: () => widget.onTap(0),
            icon: widget.currentPageIdx == 0 ? Icons.home : Icons.home_outlined,
            isSelected: widget.currentPageIdx == 0,
          ),
          BottomNavItem(
            onTap: () => widget.onTap(1),
            icon: widget.currentPageIdx == 1
                ? Icons.explore
                : Icons.explore_outlined,
            isSelected: widget.currentPageIdx == 1,
          ),
          BottomNavItem(
            onTap: () => widget.onTap(2),
            icon: widget.currentPageIdx == 2
                ? Icons.video_collection
                : Icons.video_collection_outlined,
            isSelected: widget.currentPageIdx == 2,
          ),
          BottomNavItem(
            onTap: () => widget.onTap(3),
            icon: widget.currentPageIdx == 3
                ? Icons.shopping_bag
                : Icons.shopping_bag_outlined,
            isSelected: widget.currentPageIdx == 3,
          ),
          BottomNavItem(
            onTap: () => widget.onTap(4),
            icon: widget.currentPageIdx == 4
                ? Icons.account_circle
                : Icons.account_circle_outlined,
            isSelected: widget.currentPageIdx == 4,
          ),
        ],
      ),
    );

    // return BottomNavigationBar(
    //     currentIndex: widget.currentPageIdx,
    //     onTap: widget.onTap,
    //     items: [
    //       BottomNavigationBarItem(
    //           icon: widget.currentPageIdx == 0
    //               ? const Icon(Icons.home)
    //               : const Icon(Icons.home_outlined),
    //           label: "Home"),
    //       BottomNavigationBarItem(
    //           icon: widget.currentPageIdx == 1
    //               ? const Icon(Icons.explore)
    //               : const Icon(Icons.explore_outlined),
    //           label: "Explore"),
    //       BottomNavigationBarItem(
    //           icon: Icon(widget.currentPageIdx == 2
    //               ? Icons.video_collection
    //               : Icons.video_collection_outlined),
    //           label: "Reels"),
    //       BottomNavigationBarItem(
    //           icon: Icon(widget.currentPageIdx == 3
    //               ? Icons.shopping_bag
    //               : Icons.shopping_bag_outlined),
    //           label: "Shop"),
    //       BottomNavigationBarItem(
    //           icon: Icon(widget.currentPageIdx == 4
    //               ? Icons.account_circle
    //               : Icons.account_circle_outlined),
    //           label: "Profile"),
    //     ]);
  }
}

class BottomNavItem extends StatefulWidget {
  final IconData icon;
  final bool isSelected;
  final void Function()? onTap;

  const BottomNavItem({
    Key? key,
    required this.icon,
    required this.isSelected,
    this.onTap,
  }) : super(key: key);

  @override
  State<BottomNavItem> createState() => _BottomNavItemState();
}

class _BottomNavItemState extends State<BottomNavItem> {
  bool isHover = false;

  @override
  Widget build(BuildContext context) {
    return Flexible(
      flex: 1,
      child: InkWell(
          onTap: widget.onTap,
          onHover: (value) {
            setState(() {
              isHover = value;
            });
          },
          highlightColor: Colors.transparent,
          focusColor: Colors.transparent,
          hoverColor: Colors.transparent,
          splashColor: Colors.transparent,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            color: widget.isSelected
                ? Theme.of(context).bottomNavigationBarTheme.selectedItemColor
                : isHover
                    ? isLightMode(context)
                        ? Colors.blue[50]
                        : Colors.grey[900]
                    : Theme.of(context)
                        .bottomNavigationBarTheme
                        .unselectedItemColor,
            child: Center(
              child: Icon(widget.icon,
                  color: widget.isSelected
                      ? Theme.of(context)
                          .bottomNavigationBarTheme
                          .selectedIconTheme!
                          .color
                      : Theme.of(context)
                          .bottomNavigationBarTheme
                          .unselectedIconTheme!
                          .color),
            ),
          )),
    );
    // return InkWell(
    //   child: Padding(
    //     padding: const EdgeInsets.symmetric(horizontal: 5),
    //     child: AnimatedContainer(
    //       duration: const Duration(milliseconds: 200),
    //       height: 50,
    //       width: 200,
    //       decoration: BoxDecoration(
    //         color: widget.isSelected ? Colors.grey[850] : Colors.black,
    //         borderRadius: const BorderRadius.all(Radius.circular(5)),
    //       ),
    //       child: Padding(
    //         padding: const EdgeInsets.symmetric(vertical: 0),
    //         child: Row(
    //           crossAxisAlignment: CrossAxisAlignment.center,
    //           children: [
    //             const SizedBox(
    //               width: 8,
    //             ),
    //             Icon(widget.icon,
    //                 color: widget.isSelected ? Colors.white : Colors.white60),
    //             const SizedBox(
    //               width: 8.0,
    //             ),
    //           ],
    //         ),
    //       ),
    //     ),
    //   ),
    //   onTap: widget.onTap,
    //   // onHover: (value) {
    //   //   setState(() {
    //   //     // isHovered = value;
    //   //   });
    //   // },
    //   highlightColor: Colors.transparent,
    //   focusColor: Colors.transparent,
    //   hoverColor: Colors.transparent,
    //   splashColor: Colors.transparent,
    // );
  }
}
