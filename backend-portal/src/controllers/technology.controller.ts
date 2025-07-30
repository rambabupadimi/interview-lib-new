import { Request, Response } from 'express';
import { TechnologyRepository } from '../repositories/technology.repository';

export const createTechnology = async (req: Request, res: Response) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'Technology name is required.'
    });
  }

  try {
    // Check if technology already exists
    const existingTechnology = await TechnologyRepository.findByName(name);
    if (existingTechnology) {
      return res.status(409).json({
        success: false,
        error: 'Technology already exists',
        message: 'A technology with this name already exists.'
      });
    }

    // Get user ID from authenticated request
    const user = (req as any).user;
    const created_by = user.userId;
    
    const technology = await TechnologyRepository.createTechnology({
      name,
      created_by
    });

    res.status(201).json({
      success: true,
      message: 'Technology created successfully',
      data: technology
    });
  } catch (error) {
    console.error('Error creating technology:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create technology.'
    });
  }
};

export const getAllTechnologies = async (req: Request, res: Response) => {
  try {
    const technologies = await TechnologyRepository.getAllTechnologies();
    
    res.json({
      success: true,
      message: 'Technologies retrieved successfully',
      data: technologies
    });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch technologies.'
    });
  }
};

export const getTechnologyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const technology = await TechnologyRepository.getTechnologyById(parseInt(id));
    
    if (!technology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found',
        message: 'Technology with the specified ID does not exist.'
      });
    }

    res.json({
      success: true,
      message: 'Technology retrieved successfully',
      data: technology
    });
  } catch (error) {
    console.error('Error fetching technology:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch technology.'
    });
  }
};

export const updateTechnology = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'Technology name is required.'
    });
  }

  try {
    // Check if technology exists
    const existingTechnology = await TechnologyRepository.getTechnologyById(parseInt(id));
    if (!existingTechnology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found',
        message: 'Technology with the specified ID does not exist.'
      });
    }

    // Check if new name conflicts with existing technology
    const conflictingTechnology = await TechnologyRepository.findByName(name);
    if (conflictingTechnology && conflictingTechnology.id !== parseInt(id)) {
      return res.status(409).json({
        success: false,
        error: 'Name conflict',
        message: 'A technology with this name already exists.'
      });
    }

    const updatedTechnology = await TechnologyRepository.updateTechnology(parseInt(id), {
      name
    });

    res.json({
      success: true,
      message: 'Technology updated successfully',
      data: updatedTechnology
    });
  } catch (error) {
    console.error('Error updating technology:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update technology.'
    });
  }
};

export const deleteTechnology = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Check if technology exists
    const existingTechnology = await TechnologyRepository.getTechnologyById(parseInt(id));
    if (!existingTechnology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found',
        message: 'Technology with the specified ID does not exist.'
      });
    }

    const deleted = await TechnologyRepository.deleteTechnology(parseInt(id));
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Technology deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Delete failed',
        message: 'Failed to delete technology.'
      });
    }
  } catch (error) {
    console.error('Error deleting technology:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete technology.'
    });
  }
}; 