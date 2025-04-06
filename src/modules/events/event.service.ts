import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event";
import { CreateEventDto } from "./dto/create-event.dto";
import { UserService } from "../users/user.service";
import { UpdateEventDto } from "./dto/update-event.dto";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private userService: UserService
  ) {}

  async createEvent(user_id: string, payload: CreateEventDto): Promise<{
    message: string,
    event: Event
  }> {
    const { user } = await this.userService.findUser(user_id);

    if (payload.event_date && new Date(payload.event_date) < new Date()) 
      throw new BadRequestException("event_date cannot be in the past");

    const event = this.eventRepository.create({
      ...payload,
      organizer: user
    });
    await this.eventRepository.save(event);

    return {
      message: "Successfully created event",
      event
    }
  }

  async findEventById(id: string): Promise<{
    message: string,
    event: Event
  }> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['organizer']});
    if (!event) throw new NotFoundException("Event data cannot be found");

    return {
      message: "Successfully retrieved event",
      event
    }
  }

  async retrieveAllEvents(page: number = 1, limit: number = 10, user_id?: string): Promise<{
    message: string,
    events: Event[],
    meta: {
      total: number,
      current_page: number,
      total_pages: number
    }
  }> {
    let events: Event[];
    let total: number;
    let message: string;

    if (user_id) {
      [events, total] = await this.eventRepository.findAndCount({
        where: { organizer: { id: user_id }},
        take: limit,
        skip: (page - 1) * limit
      });
      message = " Successfully retrieved events for the signed-in user";
    } else {
      [events, total] = await this.eventRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit
      });
      message = "successfully retrieved all events";
    }

    return {
      message,
      events,
      meta: {
        total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      }
    }
  }

  async updateEvent(id: string, payload: UpdateEventDto): Promise<{
    message: string,
    event: Event
  }> {
    const { event } = await this.findEventById(id);

    if (payload.event_date && new Date(payload.event_date) < new Date()) 
      throw new BadRequestException("event_date cannot be in the past");
    
    await this.eventRepository.update(event.id, payload);

    const updated_event = await this.findEventById(id);

    return {
      message: "Successfully updated event",
      event: updated_event.event
    }
  }

  async deleteEvent(id: string): Promise<{ message: string }> {
    const deleted_event = await this.eventRepository.softDelete(id);
    if (deleted_event.affected === 0) throw new BadRequestException("Could not delete event, please try again.");

    return {
      message: "Successfully deleted event"
    }
  }
}