
import { DesignPattern, PatternCategory } from './types';

export const DESIGN_PATTERNS: DesignPattern[] = [
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    category: PatternCategory.CREATIONAL,
    description: 'Lets you produce families of related objects without specifying their concrete classes.',
    whenToUse: [
      'When your code needs to work with various families of related products.',
      'When you want to provide a library of products and you want to expose only their interfaces, not their implementations.'
    ],
    pros: [
      'Compatibility between products is guaranteed.',
      'Avoids tight coupling between concrete products and client code.',
      'Supports Open/Closed Principle.'
    ],
    cons: [
      'Code may become more complicated due to many new interfaces and classes.'
    ],
    codeExample: `#include <iostream>
#include <string>
#include <memory>

class AbstractProductA {
public:
    virtual ~AbstractProductA() = default;
    virtual std::string UsefulFunctionA() const = 0;
};

class ConcreteProductA1 : public AbstractProductA {
public:
    std::string UsefulFunctionA() const override { return "Result of Product A1."; }
};

class AbstractFactory {
public:
    virtual std::unique_ptr<AbstractProductA> CreateProductA() const = 0;
    virtual ~AbstractFactory() = default;
};

class ConcreteFactory1 : public AbstractFactory {
public:
    std::unique_ptr<AbstractProductA> CreateProductA() const override {
        return std::make_unique<ConcreteProductA1>();
    }
};

int main() {
    ConcreteFactory1 factory;
    auto pA = factory.CreateProductA();
    std::cout << pA->UsefulFunctionA() << std::endl;
    return 0;
}`
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    category: PatternCategory.CREATIONAL,
    description: 'Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.',
    whenToUse: [
      'When a class can\'t anticipate the class of objects it must create.',
      'When a class wants its subclasses to specify the objects it creates.'
    ],
    pros: [
      'Avoids tight coupling between creator and concrete products.',
      'Single Responsibility Principle.',
      'Open/Closed Principle.'
    ],
    cons: ['Subclasses are required to create specific products.'],
    codeExample: `class Product {
public:
    virtual ~Product() {}
    virtual std::string Operation() const = 0;
};

class Creator {
public:
    virtual ~Creator() {}
    virtual Product* FactoryMethod() const = 0;
    std::string SomeOperation() const {
        Product* product = this->FactoryMethod();
        std::string result = product->Operation();
        delete product;
        return result;
    }
};`
  },
  {
    id: 'singleton',
    name: 'Singleton',
    category: PatternCategory.CREATIONAL,
    description: 'Ensures a class has only one instance and provides a global point of access to it.',
    whenToUse: ['Database connections', 'Logger instances', 'Global configuration.'],
    pros: ['Controlled access', 'Lazy initialization.'],
    cons: ['Hard to unit test', 'Implicit dependencies.'],
    codeExample: `class Singleton {
private:
    static Singleton* instance;
    Singleton() {}
public:
    Singleton(const Singleton&) = delete;
    void operator=(const Singleton&) = delete;
    static Singleton* getInstance() {
        if (!instance) instance = new Singleton();
        return instance;
    }
};
Singleton* Singleton::instance = nullptr;`
  },
  {
    id: 'builder',
    name: 'Builder',
    category: PatternCategory.CREATIONAL,
    description: 'Construct complex objects step by step.',
    whenToUse: ['Avoiding telescoping constructors', 'Complex configuration of objects.'],
    pros: ['Product can be varied internally', 'Better control over construction.'],
    cons: ['Requires separate ConcreteBuilder for each product type.'],
    codeExample: `class Builder {
public:
    virtual ~Builder() {}
    virtual void BuildPartA() = 0;
    virtual void BuildPartB() = 0;
};`
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: PatternCategory.CREATIONAL,
    description: 'Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.',
    whenToUse: ['Reducing subclasses', 'Copying objects without coupling to concrete classes.'],
    pros: ['Cloning at runtime', 'Reduced subclassing.'],
    cons: ['Cloning complex objects with circular references is hard.'],
    codeExample: `class Prototype {
public:
    virtual ~Prototype() {}
    virtual Prototype* clone() const = 0;
};`
  },
  {
    id: 'adapter',
    name: 'Adapter',
    category: PatternCategory.STRUCTURAL,
    description: 'Allows objects with incompatible interfaces to collaborate.',
    whenToUse: ['When you want to use an existing class, and its interface does not match the one you need.'],
    pros: ['Decouples client from implementation', 'Single Responsibility Principle.'],
    cons: ['Overall code complexity increases.'],
    codeExample: `class Target {
public:
    virtual void Request() = 0;
};

class Adaptee {
public:
    void SpecificRequest() { /* ... */ }
};

class Adapter : public Target {
    Adaptee* adaptee;
public:
    Adapter(Adaptee* a) : adaptee(a) {}
    void Request() override { adaptee->SpecificRequest(); }
};`
  },
  {
    id: 'bridge',
    name: 'Bridge',
    category: PatternCategory.STRUCTURAL,
    description: 'Decouples an abstraction from its implementation so that the two can vary independently.',
    whenToUse: [
      'When you want to avoid a permanent binding between an abstraction and its implementation.',
      'When both abstractions and their implementations should be extensible by subclassing.'
    ],
    pros: [
      'Separation of interface and implementation.',
      'Improved extensibility.',
      'Hiding implementation details from clients.'
    ],
    cons: [
      'Increased complexity.'
    ],
    codeExample: `class Implementation {
public:
    virtual ~Implementation() = default;
    virtual void operation() = 0;
};

class Abstraction {
protected:
    Implementation* impl;
public:
    Abstraction(Implementation* i) : impl(i) {}
    virtual void operation() { impl->operation(); }
};`
  },
  {
    id: 'composite',
    name: 'Composite',
    category: PatternCategory.STRUCTURAL,
    description: 'Compose objects into tree structures to represent part-whole hierarchies.',
    whenToUse: ['Representing hierarchies of objects.', 'Clients should treat individual objects and compositions uniformly.'],
    pros: ['Easier to add new components', 'Simplifies client code.'],
    cons: ['Can make the design overly general.'],
    codeExample: `class Component {
public:
    virtual ~Component() {}
    virtual void Operation() = 0;
};`
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: PatternCategory.STRUCTURAL,
    description: 'Allows behavior to be added to an individual object, dynamically, without affecting the behavior of other objects from the same class.',
    whenToUse: [
      'To add responsibilities to individual objects dynamically and transparently.',
      'When extension by subclassing is impractical.'
    ],
    pros: [
      'More flexibility than static inheritance.',
      'Avoids feature-laden classes high up in the hierarchy.'
    ],
    cons: [
      'Can result in many small objects that look alike.'
    ],
    codeExample: `class Coffee {
public:
    virtual ~Coffee() = default;
    virtual double cost() = 0;
};

class SimpleCoffee : public Coffee {
public:
    double cost() override { return 1.0; }
};

class CoffeeDecorator : public Coffee {
protected:
    Coffee* coffee;
public:
    CoffeeDecorator(Coffee* c) : coffee(c) {}
};

class MilkDecorator : public CoffeeDecorator {
public:
    MilkDecorator(Coffee* c) : CoffeeDecorator(c) {}
    double cost() override { return coffee->cost() + 0.5; }
};`
  },
  {
    id: 'facade',
    name: 'Facade',
    category: PatternCategory.STRUCTURAL,
    description: 'Provides a simplified interface to a library, a framework, or any other complex set of classes.',
    whenToUse: ['Providing a simple entry point to complex subsystems.'],
    pros: ['Isolates clients from subsystem components', 'Promotes weak coupling.'],
    cons: ['A facade can become a god object coupled to all classes of an app.'],
    codeExample: `class Subsystem1 { public: void Operation1(); };
class Subsystem2 { public: void Operation2(); };
class Facade {
    Subsystem1 s1;
    Subsystem2 s2;
public:
    void Operation() { s1.Operation1(); s2.Operation2(); }
};`
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    category: PatternCategory.STRUCTURAL,
    description: 'Use sharing to support large numbers of fine-grained objects efficiently.',
    whenToUse: ['Large amount of small objects consuming too much memory.'],
    pros: ['Significant memory reduction.'],
    cons: ['Increased runtime cost of lookup/computation.'],
    codeExample: `class Flyweight {
    std::string intrinsicState;
public:
    Flyweight(std::string state) : intrinsicState(state) {}
    void Operation(std::string extrinsicState);
};`
  },
  {
    id: 'proxy',
    name: 'Proxy',
    category: PatternCategory.STRUCTURAL,
    description: 'Provides a surrogate or placeholder for another object to control access to it.',
    whenToUse: ['Lazy loading', 'Access control', 'Remote proxy.'],
    pros: ['Control without modifying real subject', 'Performance optimization (lazy load).'],
    cons: ['Indirection overhead.'],
    codeExample: `class Subject { public: virtual void Request() = 0; };
class RealSubject : public Subject { public: void Request() override; };
class Proxy : public Subject {
    RealSubject* real;
public:
    void Request() override { if(!real) real = new RealSubject(); real->Request(); }
};`
  },
  {
    id: 'raii',
    name: 'RAII',
    category: PatternCategory.STRUCTURAL,
    description: 'Resource Acquisition Is Initialization: manages resource lifetime through object scope.',
    whenToUse: ['Managing any resource with a strict lifecycle (memory, files, locks).'],
    pros: ['Exception safety.', 'No manual cleanup.'],
    cons: ['Requires proper copy/move semantics.'],
    codeExample: `class MutexLock {
    std::mutex& m;
public:
    MutexLock(std::mutex& mutex) : m(mutex) { m.lock(); }
    ~MutexLock() { m.unlock(); }
};`
  },
  {
    id: 'crtp',
    name: 'CRTP',
    category: PatternCategory.STRUCTURAL,
    description: 'Curiously Recurring Template Pattern: achieves static polymorphism.',
    whenToUse: ['Compile-time polymorphism to avoid vtable overhead.'],
    pros: ['Better performance than virtual functions.', 'Mix-in functionality.'],
    cons: ['Complex syntax.', 'Increased binary size.'],
    codeExample: `template <typename Derived>
class Base {
public:
    void interface() { static_cast<Derived*>(this)->impl(); }
};

class Derived : public Base<Derived> {
public:
    void impl() { std::cout << "Derived Impl\\n"; }
};`
  },
  {
    id: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    category: PatternCategory.BEHAVIORAL,
    description: 'Lets you pass requests along a chain of handlers.',
    whenToUse: ['Multiple objects can handle a request.', 'Handler unknown at runtime.'],
    pros: ['Reduced coupling', 'Flexibility in assigning responsibilities.'],
    cons: ['Receipt isn\'t guaranteed.'],
    codeExample: `class Handler {
    Handler* next;
public:
    virtual void Handle(int request) { if(next) next->Handle(request); }
};`
  },
  {
    id: 'command',
    name: 'Command',
    category: PatternCategory.BEHAVIORAL,
    description: 'Encapsulate a request as an object.',
    whenToUse: ['Undo/Redo systems', 'Queueing operations.'],
    pros: ['Decouples invoker and receiver', 'Can composite commands.'],
    cons: ['Increases number of classes.'],
    codeExample: `class Command { public: virtual void Execute() = 0; };`
  },
  {
    id: 'interpreter',
    name: 'Interpreter',
    category: PatternCategory.BEHAVIORAL,
    description: 'Define a representation for a grammar and an interpreter that uses it.',
    whenToUse: ['Simple languages/DSL processing.'],
    pros: ['Easy to change grammar.'],
    cons: ['Inefficient for complex grammars.'],
    codeExample: `class Expression { public: virtual bool Interpret(std::string context) = 0; };`
  },
  {
    id: 'iterator',
    name: 'Iterator',
    category: PatternCategory.BEHAVIORAL,
    description: 'Provide a way to access elements of an aggregate object sequentially without exposing its underlying representation.',
    whenToUse: ['Accessing collection elements uniformly.'],
    pros: ['Uniform interface', 'Multiple traversals supported.'],
    cons: ['Overkill for simple collections.'],
    codeExample: `template <typename T> class Iterator { public: virtual T Next() = 0; };`
  },
  {
    id: 'mediator',
    name: 'Mediator',
    category: PatternCategory.BEHAVIORAL,
    description: 'Define an object that encapsulates how a set of objects interact.',
    whenToUse: ['Complex inter-object dependencies.'],
    pros: ['Reduced coupling', 'Centralized control.'],
    cons: ['Mediator can become very complex.'],
    codeExample: `class Mediator { public: virtual void Notify(void* sender, std::string event) = 0; };`
  },
  {
    id: 'memento',
    name: 'Memento',
    category: PatternCategory.BEHAVIORAL,
    description: 'Capture and externalize an object\'s internal state so it can be restored later.',
    whenToUse: ['Snapshots/Restore points.'],
    pros: ['Preserves encapsulation boundaries.'],
    cons: ['Costly if state is large.'],
    codeExample: `class Memento { std::string state; };`
  },
  {
    id: 'observer',
    name: 'Observer',
    category: PatternCategory.BEHAVIORAL,
    description: 'Define a one-to-many dependency between objects.',
    whenToUse: ['State changes in one object require updating others.'],
    pros: ['Loose coupling', 'Broadcast communication.'],
    cons: ['Unexpected updates.'],
    codeExample: `class Observer { public: virtual void Update() = 0; };`
  },
  {
    id: 'state',
    name: 'State',
    category: PatternCategory.BEHAVIORAL,
    description: 'Allow an object to alter its behavior when its internal state changes.',
    whenToUse: ['Behavior depends on state', 'Large conditional blocks.'],
    pros: ['State-specific behavior is localized.'],
    cons: ['Number of states can grow large.'],
    codeExample: `class State { public: virtual void Handle() = 0; };`
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: PatternCategory.BEHAVIORAL,
    description: 'Enables selecting an algorithm at runtime.',
    whenToUse: [
      'When many related classes differ only in their behavior.',
      'When you need different variants of an algorithm.'
    ],
    pros: [
      'Algorithms are interchangeable.',
      'Avoids conditional statements for selecting behavior.'
    ],
    cons: [
      'Clients must be aware of different strategies.'
    ],
    codeExample: `class Strategy {
public:
    virtual ~Strategy() = default;
    virtual void execute() = 0;
};

class ConcreteStrategyA : public Strategy {
public:
    void execute() override { std::cout << "Strategy A\\n"; }
};

class Context {
    Strategy* strategy;
public:
    void setStrategy(Strategy* s) { strategy = s; }
    void run() { strategy->execute(); }
};`
  },
  {
    id: 'template-method',
    name: 'Template Method',
    category: PatternCategory.BEHAVIORAL,
    description: 'Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.',
    whenToUse: ['Implementing invariant parts of an algorithm once.'],
    pros: ['Code reuse', 'Fixed algorithm structure.'],
    cons: ['Rigid structure.'],
    codeExample: `class Algorithm {
public:
    void Execute() { Step1(); Step2(); }
    virtual void Step2() = 0;
};`
  },
  {
    id: 'visitor',
    name: 'Visitor',
    category: PatternCategory.BEHAVIORAL,
    description: 'Represent an operation to be performed on elements of an object structure.',
    whenToUse: ['Operating on complex object trees.'],
    pros: ['New operations easily added.'],
    cons: ['Adding new element classes is hard.'],
    codeExample: `class Visitor { public: virtual void Visit(class ElementA* e) = 0; };`
  }
];
