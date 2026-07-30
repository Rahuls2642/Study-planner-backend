import { CreateCourseInput } from "../validations/create-course.validation";
import { GetCoursesQuery } from "../validations/get-courses.validation";
import { UpdateCourseInput } from "../validations/update-course.validation";

import { ApiError } from "@/config/utils/ApiError";

import { courseRepository } from "../repositories/course.repository";

import { toCourseResponse } from "../mappers/course.mapper";

class CourseService {
  async findOwnedCourse(
    courseId: string,
    userId: string
  ) {
    const course =
      await courseRepository.findById(
        courseId,
        userId
      );

    if (!course) {
      throw new ApiError(
        404,
        "Course not found"
      );
    }

    return course;
  }

  async create(
    userId: string,
    data: CreateCourseInput
  ) {
    const course = await courseRepository.create({
      userId,
      ...data,
    });

    return toCourseResponse(course);
  }

  async findAll(userId: string, query: GetCoursesQuery) {
    const { page, limit } = query;
    const offset = (page - 1) * limit;

    const { data, total } =
      await courseRepository.findAllByUserId(userId, limit, offset);

    return {
      courses: data.map(toCourseResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(
    id: string,
    userId: string
  ) {
    const course = await courseRepository.findById(
      id,
      userId
    );

    if (!course) {
      throw new ApiError(
        404,
        "Course not found"
      );
    }

    return toCourseResponse(course);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCourseInput
  ) {
    const course = await courseRepository.update(
      id,
      userId,
      data
    );

    if (!course) {
      throw new ApiError(
        404,
        "Course not found"
      );
    }

    return toCourseResponse(course);
  }

  async delete(
    id: string,
    userId: string
  ) {
    const deletedCourse =
      await courseRepository.delete(
        id,
        userId
      );

    if (!deletedCourse) {
      throw new ApiError(
        404,
        "Course not found"
      );
    }
  }
}

export const courseService = new CourseService();
