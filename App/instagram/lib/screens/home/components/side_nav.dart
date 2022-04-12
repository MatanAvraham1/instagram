import 'package:flutter/material.dart';

class SideNav extends StatefulWidget {
  final void Function(int) onTap;
  final int currentPageIdx;

  const SideNav({
    Key? key,
    required this.onTap,
    required this.currentPageIdx,
  }) : super(key: key);

  @override
  State<SideNav> createState() => _SideNavState();
}

class _SideNavState extends State<SideNav> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 50,
      height: double.infinity,
      color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
      child: Column(
        children: [
          SideNavItem(
            onTap: () => widget.onTap(0),
            icon: widget.currentPageIdx == 0 ? Icons.home : Icons.home_outlined,
            isSelected: widget.currentPageIdx == 0,
          ),
          SideNavItem(
            onTap: () => widget.onTap(1),
            icon: widget.currentPageIdx == 1
                ? Icons.explore
                : Icons.explore_outlined,
            isSelected: widget.currentPageIdx == 1,
          ),
          SideNavItem(
            onTap: () => widget.onTap(2),
            icon: widget.currentPageIdx == 2
                ? Icons.video_collection
                : Icons.video_collection_outlined,
            isSelected: widget.currentPageIdx == 2,
          ),
          SideNavItem(
            onTap: () => widget.onTap(3),
            icon: widget.currentPageIdx == 3
                ? Icons.shopping_bag
                : Icons.shopping_bag_outlined,
            isSelected: widget.currentPageIdx == 3,
          ),
          SideNavItem(
            onTap: () => widget.onTap(4),
            icon: widget.currentPageIdx == 4
                ? Icons.account_circle
                : Icons.account_circle_outlined,
            isSelected: widget.currentPageIdx == 4,
          ),
        ],
      ),
    );
  }
}

class SideNavItem extends StatefulWidget {
  final IconData icon;
  final bool isSelected;
  final void Function()? onTap;

  const SideNavItem({
    Key? key,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  }) : super(key: key);

  @override
  State<SideNavItem> createState() => _SideNavItemState();
}

class _SideNavItemState extends State<SideNavItem> {
  bool isHover = false;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 5),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: 50,
          width: double.infinity,
          decoration: BoxDecoration(
            color: widget.isSelected
                ? Theme.of(context).bottomNavigationBarTheme.selectedItemColor
                : isHover
                    ? Colors.blue[50]
                    : Theme.of(context)
                        .bottomNavigationBarTheme
                        .unselectedItemColor,
            borderRadius: const BorderRadius.all(Radius.circular(5)),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(
                  width: 8,
                ),
                Icon(widget.icon,
                    color: widget.isSelected
                        ? Theme.of(context)
                            .bottomNavigationBarTheme
                            .selectedIconTheme!
                            .color
                        : Theme.of(context)
                            .bottomNavigationBarTheme
                            .unselectedIconTheme!
                            .color),
                const SizedBox(
                  width: 8.0,
                ),
              ],
            ),
          ),
        ),
      ),
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
    );
  }
}
