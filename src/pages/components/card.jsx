import React from 'react'


const Card = ({name,price,image,location,pool,rooms,garden}) => {
  return (
    <div>
      <div className='flex flex-col items-start justify-center content-center'>
                <img src={image} className='rounded-2xl'/>
                <div className='flex justify-between items-center w-full '>
                    <div className='font-semibold'>Room in {location}</div>
                </div>
                <div className='font-thin'>{name}</div>
                <div className='font-thin'>A cozy apartment</div>
                <div className='font-thin'>10-15 Mar</div>
                <div className='font-thin'>{pool && 'Swimming Pool Available'}</div>
                <div className='font-thin'>{garden && 'Garden Available'}</div>
                <div className='font-thin'>Rooms:{rooms}</div>
                <div className='font-semibold pt-2 '>₹{price} night</div>
            </div>
    </div>
  )
}

export default Card
