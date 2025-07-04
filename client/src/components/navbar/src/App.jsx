import './App.css';
import { FaBook, FaVideo, FaHeadphones, FaImage, FaCloudUploadAlt } from 'react-icons/fa';

function App() {
  return (
    <div className="App">
        <ul>
        <li><a href='#'>
          <img src='logo192.png' alt='site logo' className='nav-logo'></img>
        </a></li>
        <li>
          <a href='#'>
        <FaBook className="icon" />TEXTS</a></li>
        <li>
          <a href='#'>
        <FaVideo className="icon" />VIDEO</a></li>
        <li>
          <a href='#'>
        <FaHeadphones className="icon" />AUDIO</a></li>
        <li>
          <a href='#'>
        <FaImage className="icon" />IMAGES</a></li>
        <li>
          <a href='#'>SIGN UP</a></li>
        <li className="border-left">
          <a href='#'>LOG IN</a></li>
        <li>
          <a href='#'>
        <FaCloudUploadAlt className="icon" />UPLOAD</a></li>
        </ul>
    </div>
  );
}

export default App;
