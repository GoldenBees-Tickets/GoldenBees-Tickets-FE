import TextToSpeech from './TextToSpeech';

const VoiceConverter = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Chuyển Đổi Văn Bản Thành Giọng Nói</h1>
      <TextToSpeech />
    </div>
  );
};

export default VoiceConverter; 