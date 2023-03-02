import React, { useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Appstate } from '../App';

const Header = () => {
    const useAppstate = useContext(Appstate);
    return (
        <div className='sticky top-0 z-10 header text-3xl flex justify-between items-center text-red-500 font-bold p-3 border-b border-gray-500'>
            <Link to={'/'}><span>Filmy<span className='text-white'>Verse</span></span></Link>
            {useAppstate.login ?
                <Link to={'/addmovie'}>
                    <h1 className='text-lg text-white cursor-pointer flex item-center'>
                        <Button><AddIcon className='mr-1' />
                            <span className='text-white'>Add New</span>
                        </Button>
                    </h1>
                </Link>
                :
                <Link to={'/login'}>
                    <h1 className='text-lg text-white bg-green-500 cursor-pointer flex item-center'>
                        <Button>
                            <span className='text-white font-medium capitalize'>LogIn</span>
                        </Button>
                    </h1>
                </Link>
            }
        </div>
    )
}

export default Header;