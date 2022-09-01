import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:instagram/screens/auth/components/online_button.dart';
import 'package:instagram/screens/home/components/post_tile.dart';
import 'package:instagram/services/posts_db_service.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class AddPostScreen extends StatefulWidget {
  const AddPostScreen({Key? key}) : super(key: key);

  @override
  State<AddPostScreen> createState() => _AddPostScreenState();
}

class _AddPostScreenState extends State<AddPostScreen> {
  final _formKey = GlobalKey<FormState>();
  String publisherComment = "";
  String location = "";
  List<String> taggedUsers = [];
  List<String> photos = [];
  final controller = PageController(initialPage: 0);

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
  }

  Widget _buildPostsPhotos() {
    return Column(
      children: [
        const Text(
          "Posts Photos",
          style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
        ),
        const SizedBox(
          height: 15,
        ),
        photos.isEmpty
            ? GestureDetector(
                onTap: () async {
                  FilePickerResult? result = await FilePicker.platform
                      .pickFiles(allowMultiple: true, type: FileType.image);
                  if (result != null) {
                    setState(() {
                      photos = result.paths.map((path) => path!).toList();
                    });
                  } else {
                    // User canceled the picker
                  }
                },
                child: Container(
                  color: Colors.black45,
                  height: 460,
                  child: const Center(
                    child: Text("Tap to add photos"),
                  ),
                ),
              )
            : Stack(
                textDirection: TextDirection.rtl,
                children: [
                  SizedBox(
                    height: 500,
                    child: Column(
                      children: [
                        SizedBox(
                          height: 460,
                          child: PageView.builder(
                              scrollBehavior: MyCustomScrollBehavior(),
                              scrollDirection: Axis.horizontal,
                              controller: controller,
                              itemCount: photos.length,
                              itemBuilder: (context, index) => Container(
                                    height: 460,
                                    decoration: BoxDecoration(
                                      image: DecorationImage(
                                          image: FileImage(
                                            File(photos[index]),
                                          ),
                                          fit: BoxFit.fitHeight),
                                    ),
                                  )),
                        ),
                        const SizedBox(
                          height: 12,
                        ),
                        SmoothPageIndicator(
                          onDotClicked: (index) {
                            controller.animateToPage(index,
                                duration: const Duration(milliseconds: 600),
                                curve: Curves.ease);
                          },
                          controller: controller,
                          count: photos.length,
                          effect: CustomizableEffect(
                            activeDotDecoration: const DotDecoration(
                                width: 12,
                                height: 12,
                                color: Colors.indigo,
                                rotationAngle: 400,
                                dotBorder: DotBorder(
                                  padding: 2,
                                  width: 2,
                                  color: Colors.indigo,
                                ),
                                borderRadius:
                                    BorderRadius.all(Radius.circular(1.3))),
                            dotDecoration: DotDecoration(
                              width: 12,
                              height: 12,
                              color: Colors.grey,
                              borderRadius: BorderRadius.circular(24),
                            ),
                            spacing: 8.0,
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          photos.clear();
                        });
                      },
                      label: Text("Clear"),
                      icon: Icon(Icons.clear)),
                ],
              ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size(double.infinity, kToolbarHeight),
        child: SafeArea(
            child: Container(
          height: kToolbarHeight,
          color: Theme.of(context).primaryColor,
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 700),
              child: Row(
                children: const [
                  BackButton(
                    color: Colors.white,
                  ),
                  SizedBox(
                    width: 15,
                  ),
                  Text(
                    "Add Post",
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 18),
                  ),
                ],
              ),
            ),
          ),
        )),
      ),
      body: Center(
        child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 700),
            child: Form(
              key: _formKey,
              child: SizedBox(
                height: double.infinity,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 40,
                      ),
                      _buildPostsPhotos(),
                      const SizedBox(
                        height: 30,
                      ),
                      TextFormField(
                        onChanged: (value) {
                          setState(() {
                            publisherComment = value;
                          });
                        },
                        decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: "Post Comment"),
                        // The validator receives the text that the user has entered.
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter some text';
                          }

                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 30,
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: "Location"),
                        // The validator receives the text that the user has entered.

                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter some text';
                          }

                          return null;
                        },
                        onChanged: (value) {
                          setState(() {
                            location = value;
                          });
                        },
                      ),
                      const SizedBox(
                        height: 30,
                      ),
                      Center(
                        child: OnlineButton(
                            textColor: Colors.white,
                            onPressed: () async {
                              try {
                                if (!_formKey.currentState!.validate()) {
                                  return;
                                }

                                await Future.delayed(
                                    Duration(seconds: 2)); // TODO: handle that
                                await PostsDBService().uploadPost(
                                    publisherComment: publisherComment,
                                    location: location,
                                    photos: photos,
                                    taggedUsers: taggedUsers);
                                Navigator.of(context).pop();
                              } catch (error) {
                                // TODO: handle the error
                              }
                            },
                            enableWhen: () {
                              return location.isNotEmpty &&
                                  publisherComment.isNotEmpty;
                              // return ;
                            },
                            text: "Publish"),
                      ),
                      SizedBox(
                        height: 25,
                      )
                    ],
                  ),
                ),
              ),
            )),
      ),
    );
  }
}
