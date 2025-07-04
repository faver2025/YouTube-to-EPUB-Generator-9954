import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrash2, FiMove, FiPlay, FiClock, FiUser } = FiIcons;

const VideoItem = ({ video, index, onRemove, onReorder }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'video',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'video',
    hover: (item) => {
      if (item.index !== index) {
        onReorder(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex gap-4 p-4 bg-white bg-opacity-10 rounded-lg cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center">
        <SafeIcon icon={FiMove} className="text-white text-opacity-60" />
      </div>
      
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-32 h-20 object-cover rounded-lg"
        />
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">
          {video.title}
        </h4>
        <div className="flex items-center gap-4 text-white text-opacity-60 text-xs">
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiUser} className="text-xs" />
            {video.channel}
          </div>
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiClock} className="text-xs" />
            {video.duration}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-white text-opacity-60 text-sm">
          #{index + 1}
        </span>
        <button
          onClick={() => onRemove(video.id)}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600 hover:bg-opacity-20 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiTrash2} className="text-sm" />
        </button>
      </div>
    </div>
  );
};

const VideoList = ({ videos, onRemove, onReorder }) => {
  return (
    <div className="space-y-3">
      {videos.map((video, index) => (
        <VideoItem
          key={video.id}
          video={video}
          index={index}
          onRemove={onRemove}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
};

export default VideoList;