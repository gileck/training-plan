import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { Person as PersonIcon } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { AppContext } from '../AppContext';
export function Users() {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const { setRoute } = React.useContext(AppContext);
    React.useEffect(() => {
        fetch('/api/usersList')
            .then(res => res.json())
            .then(data => {
                setUsers(data.users);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            })
    }, [])
    if (loading) return <></>
    if (error) return <div>Error: {error.message}</div>
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {users.map(({ name, username }) => {
                return (
                    <>
                        <ListItem
                            disablePadding
                            onClick={() => {
                                setRoute('user', { username });
                            }}
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    {/* <Avatar
                                    src={`https://cdn-icons-png.flaticon.com/512/6596/6596121.png`}
                                /> */}
                                    <PersonIcon />
                                </ListItemAvatar>
                                <ListItemText primary={name} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </>
                );
            })}
        </List>
    )
}

