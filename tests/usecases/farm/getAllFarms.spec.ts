import GetAllFarmsUseCase from '../../../src/usecases/farm/getAllFarms';
import Farm from '../../../src/domain/entities/Farm';
import { FarmRepository } from '../../../src/domain/repositories/FarmRepository';

describe('GetAllFarmsUseCase', () => {
  it('should return a list of farms from the repository', async () => {
    const mockFarms: Farm[] = [
      new Farm('1', 'Farm A', { _lat: 10, _long: 20 }, []),
      new Farm('2', 'Farm B', { _lat: 30, _long: 40 }, []),
    ];

    const mockRepository: FarmRepository = {
      getAll: jest.fn().mockResolvedValue(mockFarms),
    };

    const useCase = new GetAllFarmsUseCase(mockRepository);

    const result = await useCase.execute();

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockFarms);
  });
});
