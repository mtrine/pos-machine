import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary-response';

// Mock Cloudinary và Streamifier
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

jest.mock('streamifier', () => ({
  createReadStream: jest.fn(),
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file and return the upload response', async () => {
      const file = {
        buffer: Buffer.from('test-buffer'),
      };
    
      const mockResult: CloudinaryResponse = {
        url: 'https://path/to/file.jpg',
        message: '',
        name: '',
        http_code: 200,
      };
    
      const mockPipe = jest.fn();
    
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
        callback(null, mockResult); // Giả lập callback trả về thành công
      });
    
      (streamifier.createReadStream as jest.Mock).mockReturnValue({
        pipe: mockPipe.mockImplementation(() => {
          const mockUploadStream = (cloudinary.uploader.upload_stream as jest.Mock).mock.calls[0][1];
          if (mockUploadStream) {
            mockUploadStream(null, mockResult); // Gọi callback
          }
        }),
      });
    
      const result = await service.uploadFile(file as Express.Multer.File, 'folder');
    
      expect(result).toEqual(mockResult);
      expect(streamifier.createReadStream).toHaveBeenCalledWith(file.buffer);
      expect(mockPipe).toHaveBeenCalled(); // Kiểm tra pipe được gọi
    });
    

    it('should throw an error if the upload fails', async () => {
      const file = {
        buffer: Buffer.from('test-buffer'),
      };

      const mockError = new Error('Upload failed');

      const mockUploadStream = jest.fn((options, callback) => {
        callback(mockError, null); // Giả lập callback trả về lỗi
      });

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(mockUploadStream);
      (streamifier.createReadStream as jest.Mock).mockReturnValue({ pipe: jest.fn() });

      await expect(service.uploadFile(file as Express.Multer.File, 'folder')).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file and resolve', async () => {
      const publicId = 'file_id';
      const folder = 'folder';
    
      (cloudinary.uploader.destroy as jest.Mock).mockImplementation((id, callback) => {
        callback(null, { result: 'ok' }); // Giả lập callback trả về thành công
      });
    
      await expect(service.deleteFile(publicId, folder)).resolves.toEqual({ result: 'ok' });
    
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        `${folder}/${publicId}`,
        expect.any(Function),
      );
    });
    

    it('should throw an error if the deletion fails', async () => {
      const publicId = 'file_id';
      const folder = 'folder';
      const mockError = new Error('Deletion failed');

      (cloudinary.uploader.destroy as jest.Mock).mockImplementation((id, callback) => {
        callback(mockError, null); // Giả lập callback trả về lỗi
      });

      await expect(service.deleteFile(publicId, folder)).rejects.toThrow('Deletion failed');
    });
  });
});
