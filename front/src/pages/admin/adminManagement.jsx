import React, { useEffect, useState } from 'react';
import { Users, StarIcon, SendIcon, PercentDiamondIcon,  CodeIcon, Send } from 'lucide-react';
import axios from 'axios';

const AdminPage = () => {
  const [adminMessages, setAdminMessages] = useState();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [comments, setComments] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3307/api/data')
      .then((response) => {
        setUsers(response.data.users);
        setCourses(response.data.courses);
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const deleteUser = (userId) => {
    axios.delete(`http://localhost:3307/apiAdmin/Dusers?idu=${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.user_id !== userId));
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const deleteCourse = (courseId) => {
    axios.delete(`http://localhost:3307/api/courses?idc=${courseId}`)
      .then(() => {
        setCourses(courses.filter(course => course.course_id !== courseId));
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
      });
  };

  const deleteComment = (userID, comment) => {
    axios.delete(`http://localhost:3307/apiAdmin/Dcomm?idcom=${encodeURIComponent(userID)}&comm=${encodeURIComponent(comment)}`)
    .then(() => {
        setComments(prevComments => prevComments.filter(comm => comm.user_ID !== userID));
    })
    .catch((error) => {
        console.error('Error deleting user:', error);
    });
}

  const handleSendsMessages = () =>{
    axios.post(`http://localhost:3307/api/news?newsMessage=${adminMessages}`)
       .then(() => {
            console.log('Email sent successfully');
        })
       .catch((error) => {
            console.error('Error sending email:', error);
        });
  }

  const handleAddUser = () => {
    axios.post('http://localhost:3307/apiAdmin/addUser', {
        email: userEmail,
        password: userPassword,
        firstName: userFirstName,
        lastName: userLastName
      })
       .then(() => {
            console.log('User added successfully');
            alert('User added successfully');
            setUserEmail('');
            setUserPassword('');
        })
       .catch((error) => {
            console.error('Error adding user:', error);
        });
  }

  return (
    <div className="p-4 mb-36">
      <h1 className="text-4xl text-center text-white font-bold bg-blue-700 mb-4">CS Minds Admin System</h1>

      <div className='min-h-48  bg-gray-50 flex flex-col items-center mt-10'>
            <div><Users/>
                <h1 className='text-5xl font-bold text-gray-800'>CS Minds</h1>
                <h2 className='text-2xl text-gray-500'>Send email to all Subscribers users as Admin</h2>
            </div>
            <div>
                <form onSubmit={handleSendsMessages}>
                    <input 
                        type='text'
                        placeholder='Message'
                        className='w-full p-4 border border-gray-300 rounded-md mt-4'
                        value={adminMessages}
                        onChange={(e) => setAdminMessages(e.target.value)}
                    />
                    <button type='submit' className='w-full p-4 bg-blue-600 text-white rounded-md mt-4'>Send</button>
                </form>
            </div>
        </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">Users</h2>
      <table className="min-w-full bg-white border border-gray-300 mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{user.user_id}</td>
              <td className="py-2 px-4 border-b">{user.FullName}</td>
              <td className="py-2 px-4 border-b">{user.user_email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteUser(user.user_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-6 mb-4">Courses</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Course ID</th>
            <th className="py-2 px-4 border-b">Course Title</th>
            <th className="py-2 px-4 border-b">Course Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{course.course_id}</td>
              <td className="py-2 px-4 border-b">{course.course_title}</td>
              <td className="py-2 px-4 border-b">{course.course_description}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteCourse(course.course_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}    
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-6 mb-4">Users comments on courses</h2>
      <table className="min-w-full bg-white border border-gray-300 mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">comment</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.user_ID} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{comment.user_ID}</td>
              <td className="py-2 px-4 border-b">{comment.comment}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteComment(comment.user_ID, comment.comment)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='min-h-48  bg-gray-50 flex flex-col items-center mt-10'>
            <div><Users/>
                <h1 className='text-5xl font-bold text-gray-800'>CS Minds</h1>
                <h2 className='text-2xl text-gray-500'>Add new users</h2>
            </div>
            <div>
                <form onSubmit={handleAddUser}>
                <input 
                        type='text'
                        placeholder='First name '
                        className='w-full p-4 border border-gray-300 rounded-md mt-4'
                        value={userFirstName}
                        onChange={(e) => setUserFirstName(e.target.value)}
                    />
                    <input 
                        type='text'
                        placeholder='Last name'
                        className='w-full p-4 border border-gray-300 rounded-md mt-4'
                        value={userLastName}
                        onChange={(e) => setUserLastName(e.target.value)}
                    />
                    <input 
                        type='email'
                        placeholder='user email'
                        className='w-full p-4 border border-gray-300 rounded-md mt-4'
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <input 
                        type='password'
                        placeholder='user password'
                        className='w-full p-4 border border-gray-300 rounded-md mt-4'
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <button type='submit' className='w-full p-4 bg-blue-600 text-white rounded-md mt-4'>Add</button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default AdminPage;   
