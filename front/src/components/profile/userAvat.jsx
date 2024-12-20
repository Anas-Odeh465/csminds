import React from 'react';

const UserAvatar = ({ firstName }) => {
  const firstLetter = firstName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '50%',
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px',
      }}
    >
      {firstLetter}
    </div>
  );
};

 const UserAvatarSmall = ({ firstName }) => {
  const firstLetter = firstName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '18px',
        marginRight: '10px',
      }}
    >
      {firstLetter}
    </div>
  );
};

export { UserAvatar, UserAvatarSmall };