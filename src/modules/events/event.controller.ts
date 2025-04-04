import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Role } from "../users/entities/user";
import { AuthSessionGuard } from "../../guards/auth.guard";
import { RoleGuard } from "../../guards/role.guard";
import { Roles } from "../../decorators/role.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller("events")
@UseGuards(AuthSessionGuard, RoleGuard)
export class EventController {
  constructor(
    private eventService: EventService
  ) {}

  @Post()
  @Roles(Role.ORGANIZER)
  async createEvent(@Body() body: CreateEventDto, @Req() request) {
    return this.eventService.createEvent(request.user.user_id, body);
  }

  @Get("/me")
  @Roles(Role.ORGANIZER)
  async retrieveOrganizersEvents(@Query("page") page: number, @Query("limit") limit: number, @Req() request) {
    return this.eventService.retrieveAllEvents(page, limit, request.user.user_id, );
  }

  @Get()
  async retrieveAllEvents(@Query("page") page: number, @Query("limit") limit: number) {
    return this.eventService.retrieveAllEvents(page, limit);
  }

  @Get(":id")
  async retrieveEvent(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.eventService.findEventById(id);
  }

  @Put(":id")
  @Roles(Role.ORGANIZER)
  async updateEvent(@Param("id", new ParseUUIDPipe()) id: string, @Body() body: UpdateEventDto) {
    return this.eventService.updateEvent(id, body);
  }

  @Delete(":id")
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async deleteEvent(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.eventService.deleteEvent(id);
  }
}