// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

/** 
 * Query to find all the possible time slots for a requested meeting.
 * If there are one or more possible time slots that works for both
 * mandatory and optional attendees, return this.
 * If not return only possible time slots that works for the mandatory attendees.
 */
public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> attendees = request.getAttendees();
    long duration = request.getDuration();

    List<Event> byStartTime = events.stream()
        .sorted(Comparator.comparing(Event::getWhen, TimeRange.ORDER_BY_START))
        .collect(Collectors.toList());

    Collection<String> allAttendees = new HashSet<>();
    allAttendees.addAll(attendees);
    allAttendees.addAll(request.getOptionalAttendees());

    List<TimeRange> freeSlots = findPossibleTimeSlots(byStartTime, allAttendees, duration);
    if (freeSlots.isEmpty()) {
      freeSlots = findPossibleTimeSlots(byStartTime, attendees, duration);
    }
    
    return freeSlots;
  }

  /** 
   * Return a list with TimeRanges that indicates the possible times for a requested meeting 
   * with n attendees and x duration, avoiding overlapping with their scheduled events
   */
  private List<TimeRange> findPossibleTimeSlots(Collection<Event> sortedEvents, Collection<String> attendees, long duration) {
    List<TimeRange> timeSlots = new ArrayList<>();
    
    int endTime = 0;
    for (Event ev : sortedEvents) {
      if (!Collections.disjoint(ev.getAttendees(), attendees)) {
        if (ev.getWhen().start() >= endTime) {
          addTimeSlot(timeSlots, endTime, ev.getWhen().start(), false, duration);
        }

        endTime = Math.max(ev.getWhen().end(), endTime);
      }
    }

    addTimeSlot(timeSlots, endTime, TimeRange.END_OF_DAY, true, duration);

    return timeSlots;
  }

  /** Add a TimeRange to a list if there is room between start and end points */
  private void addTimeSlot(List<TimeRange> timesList, int start, int end, boolean inclusive, long duration) {
    if (start + duration <= end) {
      timesList.add(TimeRange.fromStartEnd(start, end, inclusive));
    }
  }
}
