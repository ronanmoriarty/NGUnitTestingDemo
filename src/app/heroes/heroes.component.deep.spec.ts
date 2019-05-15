import { HeroesComponent } from "./heroes.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, Input, Component } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

describe('HeroesComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: "SpiderDude", strength: 8 },
            { id: 2, name: "Wonderful Woman", strength: 24 },
            { id: 3, name: "SuperDude", strength: 55 },
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a hero component', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toEqual(3);
        for (let i = 0; i < heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });

    it(`should call heroService.DeleteHero when the Hero component's
        delete button is clicked.`, () => {
            spyOn(fixture.componentInstance, 'delete');
            mockHeroService.getHeroes.and.returnValue(of(HEROES));
            fixture.detectChanges();
            const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));

            (<HeroComponent>heroComponentDEs[0].componentInstance).delete.emit(undefined);

            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
        });

    it('should a new hero to the heroes list when the add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name = "Mr. Ice";
        mockHeroService.addHero.and.returnValue(of({ id: 5, name: name, strength: 4 }));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButtonElement = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addButtonElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('li'))[3].nativeElement.textContent).toContain('Mr. Ice');
    })
});