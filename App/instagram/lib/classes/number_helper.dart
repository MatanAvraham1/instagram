class NumberHelper {
  static String getShortNumber(int num) {
    if (num >= 10000 && num < 100000) {
      return "${num.toString()[0]}${num.toString()[1]}k";
    }

    if (num >= 100000 && num < 1000000) {
      return "${num.toString()[0]}${num.toString()[1]}${num.toString()[2]}K";
    }

    if (num >= 1000000 && num < 10000000) {
      return "${num.toString()[0]}M";
    }

    if (num >= 10000000 && num < 100000000) {
      return "${num.toString()[0]}${num.toString()[1]}M";
    }

    if (num >= 100000000 && num < 1000000000) {
      return "${num.toString()[0]}${num.toString()[1]}${num.toString()[1]}M";
    }

    return num.toString();
  }
}
