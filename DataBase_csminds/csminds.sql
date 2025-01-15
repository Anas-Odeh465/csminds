-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2025 at 12:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csminds`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_mind_recent_chat`
--

CREATE TABLE `ai_mind_recent_chat` (
  `user_ID` varchar(100) NOT NULL,
  `message` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_mind_recent_chat`
--

INSERT INTO `ai_mind_recent_chat` (`user_ID`, `message`) VALUES
('25', 'Hi'),
('25', 'Hi yo'),
('25', 'Hi Hi'),
('25', 'Hi you!'),
('25', 'How to make for loop in python ?'),
('25', 'thanks'),
('25', 'Hi you\n'),
('25', 'what\'s up?'),
('56', 'Hello '),
('56', 'Hi'),
('56', 'Thanks'),
('25', 'Hi!'),
('25', 'Hello \nwhat\'s up!'),
('25', 'How to create loop in python ?'),
('25', 'I don\'t know How to write a class in Java programming language can you write it ?'),
('25', 'How to print using C++ ?'),
('25', 'How to make a function in python?'),
('25', 'Hi AI ?'),
('25', 'cout << \"sha\" '),
('25', 'Generate while loop in Java'),
('55', 'How to create a function in c++ ?'),
('25', 'How to print using Java?'),
('25', 'How to make for loop in list using python?'),
('25', 'how to print anas in c++ ?'),
('25', 'I have problem with cin>>x ?'),
('25', 'how to make user input in c++ ?'),
('25', 'How to print in python?'),
('25', 'How to print Hello world in c++?'),
('25', 'How to create a class in python ?'),
('25', 'class Animal {    String name;    public Animal(String name) {        this.name = name;    }    public String speak() {        return name + \" makes a sound\";    }}class Main {    public static void main(String[] args) {        Animal dog = new Animal(\"Dog\");        System.out.println(dog.speak()); '),
('25', 'I have wrong string input error in python'),
('25', 'How to print in java'),
('25', 'Use string literals to represent text.\na = \"Hello\"\nprint(a)'),
('25', 'what\'s is lambda in python ?'),
('25', 'what\'s the output?'),
('25', 'thanks'),
('25', 'What is the difference between Integer and Float in C++?'),
('25', 'how to create array in c++ ?'),
('25', 'How to create array within a loop in c++ ?'),
('25', 'How to create array and print iteration within a loop in c++ ?'),
('25', 'How to print in Java ?'),
('55', 'What is Python ?'),
('55', 'How to create a class in java?'),
('55', 'How to create array and print iteration within a loop in c++ ?'),
('25', 'Nice course'),
('25', 'How to make for loop in python ?'),
('25', 'How to print in c++ ?'),
('25', 'How to make a class ?');

-- --------------------------------------------------------

--
-- Table structure for table `cources_comments`
--

CREATE TABLE `cources_comments` (
  `user_ID` varchar(100) NOT NULL,
  `comment` varchar(300) NOT NULL,
  `ID_course_specifier` varchar(100) NOT NULL,
  `evaluation_scores` varchar(400) DEFAULT NULL,
  `fullName` varchar(300) DEFAULT NULL,
  `photo` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cources_comments`
--

INSERT INTO `cources_comments` (`user_ID`, `comment`, `ID_course_specifier`, `evaluation_scores`, `fullName`, `photo`) VALUES
('25', 'Nice python course yehia', '16', '1', 'ANAS ODEH', '/uploads/Images/1735502208378_33.jpg'),
('25', 'gg', '16', '1', 'ANAS ODEH', '/uploads/Images/1735502208378_33.jpg'),
('55', 'Nice one Yehia ✅ ', '16', '1', 'Bro Code', '/uploads/Images/1735596080235_broCode.png'),
('59', 'good explaining python code when the part 2?', '16', '1', 'Mohammed Shaheen', '/uploads/Images/1736115915921_My Love.jpg'),
('59', 'Thank you for free course in python nice', '16', '1', 'Mohammed Shaheen', '/uploads/Images/1736115915921_My Love.jpg'),
('44', 'Good start Yehia ', '16', '1', 'Caleb Curry', '/uploads/Images/1735687534291_CAleb.png'),
('44', 'I make sure to share this course in my facebook page because it\'s good  and nice for free course', '16', '1', 'Caleb Curry', '/uploads/Images/1735687534291_CAleb.png'),
('25', 'part 2 ?', '16', '0', 'ANAS ODEH', '/uploads/Images/1735502208378_33.jpg'),
('53', 'Let\'s get started with python great', '16', '1', 'Anoos Odeh', '/uploads/Images/1736544414146_Screenshot 2024-11-08 173828.png'),
('53', 'Great HTML video bro code I understand Html easy thanks', '6', '1', 'Anoos Odeh', '/uploads/Images/1736544414146_Screenshot 2024-11-08 173828.png'),
('53', 'I will make sure to apply every tag in html my good friend', '6', '1', 'Anoos Odeh', '/uploads/Images/1736544414146_Screenshot 2024-11-08 173828.png'),
('53', 'I love c++ man ', '15', '1', 'Anoos Odeh', '/uploads/Images/1736544414146_Screenshot 2024-11-08 173828.png'),
('53', 'I hope some day learn every thing in css thanks man for this free course', '7', '1', 'Anoos Odeh', '/uploads/Images/1736544414146_Screenshot 2024-11-08 173828.png'),
('61', 'wow nice', '15', '1', 'Ellis L4D2', 'No photo available'),
('64', 'Wow that\'s a nice course, I hope that I continue with it. ', '6', '1', 'Roaa Odeh', 'No photo available'),
('59', 'I love HTML especially with framework like React js', '20', '1', 'Mohammed Shaheen', '/uploads/Images/1736115915921_My Love.jpg'),
('55', 'I\'m doing will nice', '20', '1', 'Bro Code', '/uploads/Images/1735596080235_broCode.png'),
('25', 'I have to watch this 10 times nice course bro code', '22', '1', 'ANAS ODEH', '/uploads/Images/1736540349076_33.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `user_courseID` int(111) DEFAULT NULL,
  `course_level` varchar(255) DEFAULT NULL,
  `course_title` varchar(350) NOT NULL,
  `course_category` varchar(100) NOT NULL,
  `course_evaluation` int(100) NOT NULL,
  `video_course` varchar(300) NOT NULL,
  `Published_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `course_description` varchar(500) DEFAULT NULL,
  `course_pricing` varchar(300) DEFAULT NULL,
  `ID_course_specifier` int(11) NOT NULL,
  `course_picture` varchar(200) DEFAULT NULL,
  `course_time` varchar(60) DEFAULT NULL,
  `course_language` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`user_courseID`, `course_level`, `course_title`, `course_category`, `course_evaluation`, `video_course`, `Published_date`, `course_description`, `course_pricing`, `ID_course_specifier`, `course_picture`, `course_time`, `course_language`) VALUES
(44, 'Intermediate', 'C++ Object Oriented Programming Crash Course - Introduction', 'Programming Languages', 2, '/uploads/Videos/1735674880969_y2mate.com - C Object Oriented Programming Crash Course  Introduction  Full Tutorial_1080p.mp4', '2025-01-11 01:30:40', 'C++ is a powerful programming language especially Object Oriented Program in this short video course you get full into to oop, and if you want track C++ keep tracking it you will know later.', 'Free', 15, '/uploads/Images/1735674881663_CppOOp.png', '30 minute', 'English'),
(57, 'Beginner', ' كورس شرح أساسيات البرمجة في بايثون خلال ساعة واحدة', 'Programming Languages', 8, '/uploads/Videos/1735680637509_y2mate.com - 1 ÙÙØ±Ø³ Ø´Ø±Ø­ Ø£Ø³Ø§Ø³ÙØ§Øª Ø§ÙØ¨Ø±ÙØ¬Ø© ÙÙ Ø¨Ø§ÙØ«ÙÙ Ø®ÙØ§Ù Ø³Ø§Ø¹Ø© ÙØ§Ø­Ø¯Ø©  Ø¬Ø²Ø¡  Python in 1 Hour  Part 1  Algorithms_1080pFHR.mp4', '2025-01-10 21:28:25', ' شرح عملي للبرمجة بلغة بايثون في الفيديو رح نتعرف على مبادئ البرمجة واساسياتها وكيفية كتابة الكود الي رح تسهل عليك تعلم اي لغة اخرى', 'Free', 16, '/uploads/Images/1735680644292_basics python.png', '1 Hour', 'Arabic'),
(55, 'Beginner', 'Learn HTML in 1 Hour full course for free', 'Web Development', 2, '/uploads/Videos/1736609188875_y2mate.com - Learn HTML in 1 hour _1080.mp4', '2025-01-11 20:14:34', 'HTML it\'s a simple programming view language to start with web development and keep going', 'Free', 20, '/uploads/Images/1736609192278_HTML course img.png', '1 Hour', 'English'),
(55, 'Beginner', 'Learn CSS full course to continue to advance css', 'Web Development', 1, '/uploads/Videos/1736684656071_y2mate.com - Learn CSS in 1 hour _1080.mp4', '2025-01-13 11:53:10', 'this course will teach you every things you need to know css style in html and make you able to go with advance css course ', 'Free', 22, '/uploads/Images/1736684659845_CSS cours.png', '1 Hour', 'English');

-- --------------------------------------------------------

--
-- Table structure for table `courses_outcomes`
--

CREATE TABLE `courses_outcomes` (
  `user_courseID` varchar(50) DEFAULT NULL,
  `outcome_1` varchar(200) DEFAULT NULL,
  `outcome_2` varchar(200) DEFAULT NULL,
  `outcome_3` varchar(200) DEFAULT NULL,
  `outcome_4` varchar(200) DEFAULT NULL,
  `ID_course_specifier` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses_outcomes`
--

INSERT INTO `courses_outcomes` (`user_courseID`, `outcome_1`, `outcome_2`, `outcome_3`, `outcome_4`, `ID_course_specifier`) VALUES
('44', 'We will learn about object and how to handle it', 'Apply on classes', NULL, NULL, 15),
('57', 'معرفة كيفية بناء الجمل في البايثون', 'المتغيرات وادخالات المستخدم', 'الشروط if elif else والاشارات المنطقية', 'التكرار  و الوظائف', 16),
('55', 'Full explaining for every code tag', 'start with web development', NULL, NULL, 20),
('55', 'Full knowledge about css basic to reach advance courses', 'Good skill for bignner', NULL, NULL, 22);

-- --------------------------------------------------------

--
-- Table structure for table `courses_requirements`
--

CREATE TABLE `courses_requirements` (
  `user_courseID` varchar(50) DEFAULT NULL,
  `requirement_1` varchar(200) DEFAULT NULL,
  `requirement_2` varchar(200) DEFAULT NULL,
  `requirement_3` varchar(200) DEFAULT NULL,
  `requirement_4` varchar(200) DEFAULT NULL,
  `ID_course_specifier` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses_requirements`
--

INSERT INTO `courses_requirements` (`user_courseID`, `requirement_1`, `requirement_2`, `requirement_3`, `requirement_4`, `ID_course_specifier`) VALUES
('44', 'Knowledge in Basics C++', 'Cup of coffee', NULL, NULL, 15),
('57', 'مطلوب منك تكون مركز معايا في الفيديو', 'تنساش تجيب معك قهوة', NULL, NULL, 16),
('55', 'practice every tag you learned', 'cup if coffee', NULL, NULL, 20),
('55', 'A cup of coffee', 'Practice every thing you learned in your Html code', NULL, NULL, 22);

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `user_ID` int(20) NOT NULL,
  `instructor_name` varchar(60) NOT NULL,
  `work_Email` varchar(200) NOT NULL,
  `role` varchar(60) NOT NULL,
  `number_Learners` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`user_ID`, `instructor_name`, `work_Email`, `role`, `number_Learners`) VALUES
(25, 'ANAS ODEH', 'aodeh462@gmail.com', 'Teacher', 0),
(53, 'Anoos Odeh', 'anasstop232@gmail.com', 'Teacher', 0),
(55, 'Bro Code', 'cbro02932@gmail.com', 'Teacher', 20),
(44, 'Caleb Curry', 'sh6354395@gmail.com', 'Teacher', 6),
(57, 'Yehia Tech', 'anasunit30@gmail.com', 'Teacher', 11),
(58, 'Hind Bondoq', 'hindbondoq@gmail.com', 'Teacher', 0),
(59, 'Mohammed Shaheen', 'wwwmohammedshaheen5@gmail.com', 'Teacher', 0);

-- --------------------------------------------------------

--
-- Table structure for table `matching_pairs`
--

CREATE TABLE `matching_pairs` (
  `pair_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `item_1` varchar(255) NOT NULL,
  `item_2` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `multiple_choice_options`
--

CREATE TABLE `multiple_choice_options` (
  `option_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `option_text` varchar(255) NOT NULL,
  `is_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `multiple_choice_options`
--

INSERT INTO `multiple_choice_options` (`option_id`, `question_id`, `option_text`, `is_correct`) VALUES
(5, 5, 'button', 0),
(6, 5, 'input', 0),
(7, 5, 'textarea', 0),
(8, 5, 'all tags', 1),
(9, 8, 'outside the body', 1),
(10, 8, 'in the body', 0),
(11, 8, 'in the main', 0),
(12, 8, 'another answer', 0),
(13, 9, 'head', 0),
(14, 9, 'body', 0),
(15, 9, 'main', 1),
(16, 9, 'nav', 0),
(21, 21, 'backcolor-white', 0),
(22, 21, 'bg-white', 1),
(23, 21, 'background-white', 0),
(24, 21, 'white-color', 0),
(25, 24, 'System.out.print(\'Hello World\');', 0),
(26, 24, 'print(\"Hello world\")', 0),
(27, 24, 'console.log(\'Hello World\');', 1),
(28, 24, 'log(\'Hello\')', 0);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `item_text` varchar(255) NOT NULL,
  `order_position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projectadmin`
--

CREATE TABLE `projectadmin` (
  `userName` varchar(200) NOT NULL,
  `Password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projectadmin`
--

INSERT INTO `projectadmin` (`userName`, `Password`) VALUES
('ANASadmin', 'ad12min34');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('multiple_choice','true_false','short_answer','matching_pairs','order_items') NOT NULL,
  `points` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `quiz_id`, `question_text`, `question_type`, `points`) VALUES
(4, 2, 'Title tag written in body ?', 'true_false', 1),
(5, 2, 'id attribute written in ', 'multiple_choice', 1),
(6, 2, 'write a tag that hold the picture', 'short_answer', 1),
(8, 2, 'The head tag written...', 'multiple_choice', 1),
(9, 3, 'The content inside the <tag> element should be unique to the document', 'multiple_choice', 1),
(10, 3, 'meta tag Define keywords for search engines', 'true_false', 1),
(11, 3, 'All HTML documents must start with...', 'short_answer', 1),
(12, 3, 'Write the tag specifies independent, self-contained content.', 'short_answer', 1),
(13, 3, 'The tag defines a section in a document.', 'short_answer', 1),
(20, 8, 'Margin used to change the width', 'true_false', 1),
(21, 8, 'to change the background color using tailwind css...', 'multiple_choice', 1),
(22, 8, 'How to increase the size of img', 'short_answer', 1),
(23, 8, 'to make hover in tailwind css  hover-bg-white', 'true_false', 1),
(24, 9, 'to print in javaScript we use ...', 'multiple_choice', 1),
(25, 9, 'javaScript use for request json', 'true_false', 1);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `quiz_id` int(11) NOT NULL,
  `quiz_title` varchar(100) NOT NULL,
  `quiz_description` text DEFAULT NULL,
  `time_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ID_course_specifier` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quiz_id`, `quiz_title`, `quiz_description`, `time_limit`, `created_at`, `ID_course_specifier`) VALUES
(2, 'Quiz 1', 'HTML Quiz course to improve your knowledge.', 5, '2025-01-11 19:04:20', '20'),
(3, 'Quiz 2', 'quiz 2 include advance tags you will use it in the future but i leaned you these tag bro ', 5, '2025-01-11 19:40:19', '20'),
(8, 'Quiz 1 ', 'Be sure you finished the Hole my Css course ', 5, '2025-01-12 18:21:10', '22'),
(9, 'test js', 'lol', 3, '2025-01-12 18:38:04', '22');

-- --------------------------------------------------------

--
-- Table structure for table `registerd_user`
--

CREATE TABLE `registerd_user` (
  `id` int(10) UNSIGNED NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verification_code` varchar(10) DEFAULT NULL,
  `reset_code` varchar(10) DEFAULT NULL,
  `code_expiry` datetime DEFAULT NULL,
  `verification_state` varchar(20) DEFAULT NULL,
  `userType` varchar(50) DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `headline` varchar(100) DEFAULT NULL,
  `biography` varchar(500) DEFAULT NULL,
  `X` varchar(250) DEFAULT NULL,
  `youtube` varchar(250) DEFAULT NULL,
  `linkedin` varchar(250) DEFAULT NULL,
  `facebook` varchar(250) DEFAULT NULL,
  `student_enrolled_state` varchar(50) DEFAULT NULL,
  `student_enrolled_status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registerd_user`
--

INSERT INTO `registerd_user` (`id`, `FirstName`, `LastName`, `email`, `password`, `verification_code`, `reset_code`, `code_expiry`, `verification_state`, `userType`, `profileImage`, `headline`, `biography`, `X`, `youtube`, `linkedin`, `facebook`, `student_enrolled_state`, `student_enrolled_status`) VALUES
(25, 'ANAS', 'ODEH', 'aodeh462@gmail.com', '$2b$10$TvJF0z0GiepnxhJCwGTeA.6RN0EquDTtN2mI5yGecANCzthXYeDZe', '3520', NULL, NULL, 'Verifyed User', 'Admin', '/uploads/Images/1736540349076_33.jpg', 'Admin', 'My name is Anas Odeh and I am 23 years old.\n\nI studied computer information systems at Al Hussein bin Talal University with a bachelor\'s degree......', 'https://x.com/Anas_odeh_505', 'https://www.youtube.com/@aaaa462-c6w', 'https://www.linkedin.com/in/anas-odeh-946b10288/', 'https://www.facebook.com/profile.php?id=100022896428859&mibextid=ZbWKwL', NULL, 'enrolled'),
(44, 'Caleb', 'Curry', 'sh6354395@gmail.com', '$2b$10$9MXahdlqXHnXiDwdEy2ckua0dKzITNH3njFyy.JczlgZMzTsduDHq', '2011', NULL, NULL, 'Verifyed User', NULL, '/uploads/Images/1735687534291_CAleb.png', 'They said it couldn\'t be done', 'Programming Made Fun and Simple  \n\nHigh quality tutorials that are fun, educational, and easy to follow.  Teaching programming is my passion!  I find joy in making complex material easy to understand.\n\nI\'ve decided that it is only right to upload videos of great quality and value.  Here you will find videos on C++, JavaScript, C, database design, SQL, and more!  As a side note, many videos contain cringey and random stories...you\'ve been warned', 'https://x.com/CalebCurry', 'https://www.youtube.com/@codebreakthrough', 'https://www.linkedin.com/in/calebcurry?trk=feed-detail_main-feed-card_feed-actor-name', 'https://www.facebook.com/profile.php?id=100014902244121', NULL, NULL),
(45, 'Suliman', 'OO', 'suliman.bh85@gmail.com', '$2b$10$oJp/rOxECIwFOPA4q7oyoucCsZVXQpRvf3ddrZ9SdhuYwHhhgjQ7i', '1286', NULL, NULL, 'Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 'dodo', 'Odeh', 'dodo876@gmail.com', '$2b$10$s929TqbXPGweglmmaibY1u9vCyw5KKhj8UzN0MGTJ8YU9E0RIL/Dy', '8640', NULL, NULL, 'Not Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 'Moyed', 'Odeh', 'moaedabdo2@gmail.com', '$2b$10$QZjsztZlZODRf5DTE4PiS.ndj1LTukbm3WPAWUS3CGqoM0JG0pUtm', '2848', NULL, NULL, 'Verifyed User', NULL, NULL, 'Instructor ', 'Hello there ', NULL, NULL, NULL, NULL, NULL, NULL),
(50, 'ddd', 'aaa', 'hhh.hijawy@gmail.com', '$2b$10$IOr0xn0HueuoZT9lJD9rl.mTIWYp.udNgdmIY1BxaIQU999vmTwYq', '9593', NULL, NULL, 'Not Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 'Csminds', 'Gaming', 'csminds1001@gmail.com', '$2b$10$iksaW9cCXrd4R8PmzEYH..y47XCOHi4FF6bzOezRvLJRlUVytaYli', '2605', NULL, NULL, 'Verifyed User', NULL, '/uploads/Images/1734742955265_Screenshot 2024-09-09 192439.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 'Mohammad', 'Odeh', 'mouhamadodeh51@gmail.com', '$2b$10$riBBmT3bA28jfIR1aECQB.fEex.uk/Ap1hZHlEkTCqBOD7fYq7KJe', '2561', NULL, NULL, 'Verifyed User', NULL, 'blob:http://localhost:5173/c66a3a9d-394c-432a-bcf6-46c7513126e2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 'Anoos', 'Odeh', 'anasstop232@gmail.com', '$2b$10$DTsT4SgCCdsoHzfE.ZBRM.uIgoJ2ICMmg8raRXLG6Sa3GVXJRLDii', '5244', NULL, NULL, 'Verifyed User', NULL, '/uploads/Images/1736544414146_Screenshot 2024-11-08 173828.png', 'Computer Science', 'I hope some day to reach my ideas first', 'https://x.com/Anas_odeh_505', 'https://www.youtube.com/@aaaa462-c6w', 'https://www.linkedin.com/in/anas-odeh-946b10288/', 'https://www.facebook.com/profile.php?id=100022896428859&mibextid=ZbWKwL', NULL, 'enrolled'),
(54, 'Oo', 'Hh', 'oohh890@gmail.com', '$2b$10$ZZA1EC5kpb37ZnIvPNvzoemG7nXCDJjMDGv.pwlqWxiV9NEpv9HZu', '4060', NULL, NULL, 'Not Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 'Bro', 'Code', 'cbro02932@gmail.com', 'Google-Account', NULL, NULL, NULL, 'Verified User', NULL, '/uploads/Images/1735596080235_broCode.png', 'Professor of Computer Science', 'Dr. Anas Odeh is a distinguished Professor of Computer Science with over 20 years of experience in academia and industry. With a passion for technology and a commitment to inspiring future leaders, Dr. Smith has dedicated his career to bridging the gap between theory and practical application in the ever-evolving world of computer science.', 'https://x.com/Anas_odeh_505', 'https://www.youtube.com/@aaaa462-c6w', 'https://www.linkedin.com/in/anas-odeh-946b10288/', 'https://www.facebook.com/profile.php?id=100022896428859&mibextid=ZbWKwL', NULL, 'enrolled'),
(56, 'Abood', 'Alruzzi', 'aboodalrozzi66@gmail.com', '$2b$10$3DUVmfB3hdQrXj9LSfrd2ugkDOX3JfMObNsVouYczWLbZNOLrdyu6', '3848', NULL, NULL, 'Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 'Yehia', 'Tech', 'anasunit30@gmail.com', '$2b$10$sRsrX4NCHGBZ6U8xVcNwauRUo0Q4YDh4ayaU2r34d1/jynRbYfiMW', '1871', NULL, NULL, 'Verifyed User', NULL, '/uploads/Images/1735679060660_ÙØ­ÙÙ ØªÙ.png', 'Software engineer ', 'I\'m Yehia, a developer with a passion for teaching. I\'m the lead instructor at the London App Brewery, London\'s leading Programming Bootcamp. I\'ve helped hundreds of thousands of students learn to code and change their lives by becoming a developer. I\'ve been invited by companies such as Twitter, Facebook, and Google to teach their employees.', NULL, 'https://www.youtube.com/@yehiatech', NULL, NULL, NULL, NULL),
(59, 'Mohammed', 'Shaheen', 'wwwmohammedshaheen5@gmail.com', '$2b$10$ZyHi4pYbKsoI/YYZ.0z/o.jfPAOPeEG1cZXA9PN8rre5etZctpLKu', '7894', NULL, NULL, 'Verifyed User', NULL, '/uploads/Images/1736115915921_My Love.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'enrolled'),
(61, 'Ellis', 'L4D2', 'anasod082002@gmail.com', '$2b$10$.qtojQKhpMsYsWRbwPs2IeZ.xl7AA.cXF8We5vFTmNfxwDB797orO', '4074', NULL, '2025-01-11 05:02:44', 'Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'enrolled'),
(62, 'Old', 'Man', 'odehanas542@gmail.com', '$2b$10$Y1buJ.Cpv379wbAW20.rwuId9TuHylJPB70kS0A.NGtEXyKbPqrBC', '4678', NULL, '2025-01-11 05:18:04', 'Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 'Roaa', 'Odeh', 'roaamoayad@gmail.com', '$2b$10$Xpcu0UclD5PiV0/WJzkWU.GTElzgzyDKKsT8L7TJypWcrm/u3n.oS', '3883', NULL, '2025-01-11 13:38:51', 'Verifyed User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'enrolled');

-- --------------------------------------------------------

--
-- Table structure for table `short_answer_answers`
--

CREATE TABLE `short_answer_answers` (
  `question_id` int(11) NOT NULL,
  `correct_answer` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `short_answer_answers`
--

INSERT INTO `short_answer_answers` (`question_id`, `correct_answer`) VALUES
(6, '<img/>'),
(11, '<!DOCTYPE html>'),
(12, '<article></article>'),
(13, ' <section></section>'),
(22, 'w-48 h-36');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers_users`
--

CREATE TABLE `subscribers_users` (
  `emails` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscribers_users`
--

INSERT INTO `subscribers_users` (`emails`) VALUES
('aodeh462@gmail.com'),
(''),
('sh6354395@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `true_false_answers`
--

CREATE TABLE `true_false_answers` (
  `question_id` int(11) NOT NULL,
  `correct_answer` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `true_false_answers`
--

INSERT INTO `true_false_answers` (`question_id`, `correct_answer`) VALUES
(4, 0),
(10, 1),
(20, 0),
(23, 0),
(25, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users_attempt_quizzes`
--

CREATE TABLE `users_attempt_quizzes` (
  `user_ID` varchar(300) NOT NULL,
  `quiz_ID` varchar(300) NOT NULL,
  `state_quizTO_user` varchar(100) DEFAULT NULL,
  `Mark` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_attempt_quizzes`
--

INSERT INTO `users_attempt_quizzes` (`user_ID`, `quiz_ID`, `state_quizTO_user`, `Mark`) VALUES
('25', '2', 'done', '3'),
('55', '2', 'done', '3'),
('55', '3', 'done', '1'),
('25', '8', 'done', '1'),
('55', '8', 'done', '3'),
('25', '9', 'done', '1'),
('55', '9', 'done', '1');

-- --------------------------------------------------------

--
-- Table structure for table `users_carts`
--

CREATE TABLE `users_carts` (
  `user_ID` varchar(100) NOT NULL,
  `ID_course_specifier` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_carts`
--

INSERT INTO `users_carts` (`user_ID`, `ID_course_specifier`) VALUES
('25', '19'),
('25', '8');

-- --------------------------------------------------------

--
-- Table structure for table `user_learning`
--

CREATE TABLE `user_learning` (
  `user_ID` varchar(100) NOT NULL,
  `ID_course_specifier` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_learning`
--

INSERT INTO `user_learning` (`user_ID`, `ID_course_specifier`) VALUES
('25', 15),
('25', 16),
('25', 22),
('53', 15),
('53', 16),
('55', 22),
('59', 20);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`ID_course_specifier`);

--
-- Indexes for table `courses_outcomes`
--
ALTER TABLE `courses_outcomes`
  ADD KEY `fk_course_specifier_outcomes` (`ID_course_specifier`);

--
-- Indexes for table `courses_requirements`
--
ALTER TABLE `courses_requirements`
  ADD KEY `fk_course_specifier_requirements` (`ID_course_specifier`);

--
-- Indexes for table `matching_pairs`
--
ALTER TABLE `matching_pairs`
  ADD PRIMARY KEY (`pair_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `multiple_choice_options`
--
ALTER TABLE `multiple_choice_options`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quiz_id`);

--
-- Indexes for table `registerd_user`
--
ALTER TABLE `registerd_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `short_answer_answers`
--
ALTER TABLE `short_answer_answers`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `true_false_answers`
--
ALTER TABLE `true_false_answers`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `users_attempt_quizzes`
--
ALTER TABLE `users_attempt_quizzes`
  ADD UNIQUE KEY `unique_quiz_user` (`quiz_ID`,`user_ID`);

--
-- Indexes for table `users_carts`
--
ALTER TABLE `users_carts`
  ADD PRIMARY KEY (`ID_course_specifier`);

--
-- Indexes for table `user_learning`
--
ALTER TABLE `user_learning`
  ADD UNIQUE KEY `unique_user_course_learning` (`user_ID`,`ID_course_specifier`),
  ADD KEY `fk_course_learn` (`ID_course_specifier`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `ID_course_specifier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `matching_pairs`
--
ALTER TABLE `matching_pairs`
  MODIFY `pair_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `multiple_choice_options`
--
ALTER TABLE `multiple_choice_options`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `registerd_user`
--
ALTER TABLE `registerd_user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses_outcomes`
--
ALTER TABLE `courses_outcomes`
  ADD CONSTRAINT `fk_course_specifier_outcomes` FOREIGN KEY (`ID_course_specifier`) REFERENCES `courses` (`ID_course_specifier`) ON DELETE CASCADE;

--
-- Constraints for table `courses_requirements`
--
ALTER TABLE `courses_requirements`
  ADD CONSTRAINT `fk_course_specifier_requirements` FOREIGN KEY (`ID_course_specifier`) REFERENCES `courses` (`ID_course_specifier`) ON DELETE CASCADE;

--
-- Constraints for table `matching_pairs`
--
ALTER TABLE `matching_pairs`
  ADD CONSTRAINT `matching_pairs_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `multiple_choice_options`
--
ALTER TABLE `multiple_choice_options`
  ADD CONSTRAINT `multiple_choice_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `short_answer_answers`
--
ALTER TABLE `short_answer_answers`
  ADD CONSTRAINT `short_answer_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `true_false_answers`
--
ALTER TABLE `true_false_answers`
  ADD CONSTRAINT `true_false_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_learning`
--
ALTER TABLE `user_learning`
  ADD CONSTRAINT `fk_course_learn` FOREIGN KEY (`ID_course_specifier`) REFERENCES `courses` (`ID_course_specifier`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
