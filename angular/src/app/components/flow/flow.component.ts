import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AppClockComponent } from '../app-clock/app-clock.component';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { FooterComponent } from '../footer/footer.component';
import { Node, Edge, NgxGraphModule, Layout } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';
import { DagreNodesOnlyLayout } from './customDargeNode';
import { Subject, timer } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { DndModule } from 'ngx-drag-drop';
import { DndDropEvent } from 'ngx-drag-drop';

export class Employee {
  id: string;
  name: string;
  office: string;
  role: string;
  backgroundColor: string;
  upperManagerId?: string;
}
@Component({
  selector: 'app-flow',
  standalone: true,
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css'],
  imports: [
    NgCircleProgressModule, MatButtonModule, DragDropModule, NgxGraphModule, MatSidenavModule, MatSliderModule, DndModule,
    RouterLink, RouterOutlet, NgOptimizedImage, CommonModule, FormsModule, AppClockComponent, FooterComponent, CurrentWeatherComponent,
  ],
})
export class FlowComponent implements OnInit {

  @Input() employees: Employee[] = [];
  update$: Subject<boolean> = new Subject();
  private canInsert = true;  // Cooldown flag for insertions

  public nodes: Node[] = [];
  public links: Edge[] = [];
  public layoutSettings = {
    orientation: 'TB'
  };
  public curve: any = shape.curveBundle;
  public layout: Layout = new DagreNodesOnlyLayout();
  actions = [
    { id: 'action-1', label: 'Start Node', color: '#FFD700' },
    { id: 'action-2', label: 'Condition Node', color: '#00BFFF' },
    { id: 'action-3', label: 'End Node', color: '#FF6347' },
    // Add more actions as needed
  ];
  constructor(private cdr: ChangeDetectorRef) {
    this.employees = [
      {
        id: '1',
        name: 'Employee 1',
        office: 'Office 1',
        role: 'Manager',
        backgroundColor: '#DC143C'
      },
      {
        id: '2',
        name: 'Employee 2',
        office: 'Office 2',
        role: 'Engineer',
        backgroundColor: '#FFE0B2',
        upperManagerId: '1'
      },
      {
        id: '3',
        name: 'Employee 3',
        office: 'Office 3',
        role: 'Engineer',
        backgroundColor: '#C8E6C9',
        upperManagerId: '2'
      },
      {
        id: '4',
        name: 'Employee 4',
        office: 'Office 4',
        role: 'Engineer',
        backgroundColor: '#00FFFF',
        upperManagerId: '3'
      },
      {
        id: '5',
        name: 'Employee 5',
        office: 'Office 5',
        role: 'Student',
        backgroundColor: '#8A2BE2',
        upperManagerId: '4'
      }
    ];
  }

  public ngOnInit(): void {
    this.initFlow()

  }
  onDragStart(event: any): void {
    console.log('Drag Start:', event);
  }

  onDragEnd(event: any): void {
    console.log('Drag End:', event);
  }

  onDrop(event: DndDropEvent): void {
    console.log('Dropped:', event);

    if (event.data && event.data.type === 'action') {
      const newNodeId = `node-${Math.random().toString(36).substr(2, 9)}`;
      const newNode = {
        id: newNodeId,
        label: event.data.label,
        color: '#3F51B5',
      };

      this.nodes.push(newNode);

      // Liên kết với node trước đó (nếu có)
      if (this.nodes.length > 1) {
        const lastNodeId = this.nodes[this.nodes.length - 2].id;
        this.links.push({
          source: lastNodeId,
          target: newNodeId,
          label: 'Link',
        });
      }

      // Cập nhật lại layout
      this.update$.next(true);
    }
  }

  onDragover(event: any): void {
    event.preventDefault();
    console.log('Dragging over ngx-graph:', event);
  }
  initFlow() {
    for (const employee of this.employees) {
      const node: Node = {
        id: employee.id,
        label: employee.name,
        data: {
          office: employee.office,
          role: employee.role,
          backgroundColor: employee.backgroundColor
        }
      };

      this.nodes.push(node);
    }

    for (const employee of this.employees) {
      if (!employee.upperManagerId) {
        continue;
      }

      const edge: Edge = {
        source: employee.upperManagerId,
        target: employee.id,
        label: '',
        data: {
          linkText: 'Manager of'
        }
      };

      this.links.push(edge);
    }
  }

  getStyles(node: any) {
    return {
      'background-color': node.data.backgroundColor || 'white', // Default to white if no color is set
      'font-size': '18px'
    };
  }
  onNodeClick(node) {
    // Logic to handle adding a new node
    // You could open a dialog to select the node type
    console.log("Add node to:", node.label);
  }
  onYesClick(node: Node) {
    console.log("Yes clicked for node:", node.label);
    // Handle the "Yes" logic
  }

  onNoClick(node: Node) {
    console.log("No clicked for node:", node.label);
    // Handle the "No" logic
  }

  insertNode(targetNode: Node, type: 'standard' | 'condition') {
    if (!this.canInsert) return; // If already inserting, exit
    this.canInsert = false;

    console.log(targetNode);

    timer(500).subscribe(() => {
      const targetIndex = this.nodes.findIndex(n => n.id === targetNode.id);
      if (targetIndex === -1) return;

      // Create a new node with a unique ID based on the targetNode's ID
      let newNodeId: string;
      let newNode: Node;

      if (type === 'condition') {
        // Create a condition node
        newNodeId = `${targetNode.id}-condition`;
        newNode = {
          id: newNodeId,
          label: 'Condition Node',
          data: {
            office: 'Decision Point',
            role: 'Condition',
            backgroundColor: '#FFDD57', // Color for condition nodes
            isCondition: true // Mark it as a condition node
          }
        };

        // Create Yes and No branches
        const yesNodeId = `${newNodeId}-yes`;
        const noNodeId = `${newNodeId}-no`;

        const yesNode: Node = {
          id: yesNodeId,
          label: 'Yes',
          data: {
            office: 'Yes Branch',
            role: 'Yes Response',
            backgroundColor: '#A0D468' // Color for Yes branch
          }
        };

        const noNode: Node = {
          id: noNodeId,
          label: 'No',
          data: {
            office: 'No Branch',
            role: 'No Response',
            backgroundColor: '#F44336' // Color for No branch
          }
        };
        // Create links for Yes and No branches
        this.links.push({
          source: targetNode.id,
          target: newNode.id,
          label: 'Yes',
          data: { linkText: 'Yes Branch' }
        });
        // Insert the condition node and its branches
        this.nodes.splice(targetIndex + 1, 0, newNode, yesNode, noNode);
        // Create links for Yes and No branches

        // Create links for Yes and No branches
        this.links.push({
          source: newNode.id,
          target: yesNode.id,
          label: 'Yes',
          data: { linkText: 'Yes Branch' }
        });

        this.links.push({
          source: newNode.id,
          target: noNode.id,
          label: 'No',
          data: { linkText: 'No Branch' }
        });
      } else {
        // Create a standard node
        newNodeId = `${targetNode.id}-child`;
        newNode = {
          id: newNodeId,
          label: `New Employee ${newNodeId}`,
          data: { office: `New Office ${newNodeId}`, role: 'New Role', backgroundColor: '#A9A9A9' }
        };

        // Insert the new node immediately after the target node
        this.nodes.splice(targetIndex + 1, 0, newNode);

        // Create a new link from the target node to the new node
        this.links.push({
          source: targetNode.id,
          target: newNodeId,
          label: '',
          data: { linkText: 'Manager of' }
        });
      }

      console.log(this.links);
      this.update$.next(true);
      this.canInsert = true; // Reset cooldown flag
      this.cdr.detectChanges(); // Trigger change detection manually
    });
  }

}
